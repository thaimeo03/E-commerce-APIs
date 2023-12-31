import { ObjectId, WithId } from 'mongodb'
import databaseService from './database.service'
import User from '~/models/database/User'
import { Role } from '~/constants/enums'
import hashPassword from '~/utils/hash'
import { signToken } from '~/utils/jwt'
import 'dotenv/config'
import RefreshToken from '~/models/database/RefreshToken'
import { UpdateUserBody, UserRegisterBody } from '~/models/interfaces/users.interface'
import { sendEmailVerifyForgotPassword } from '~/utils/sendEmail'

class UserService {
  async signAccessToken({ user_id, role }: { user_id: string; role?: Role }) {
    const access_token = await signToken(
      {
        user_id,
        role: role || Role.User,
        token_type: process.env.JWT_ACCESS_TOKEN
      },
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
      }
    )
    return access_token
  }

  async signRefreshToken({ user_id, role, exp }: { user_id: string; role?: Role; exp?: number }) {
    const refresh_token = await signToken({
      user_id,
      role: role || Role.User,
      token_type: process.env.JWT_REFRESH_TOKEN,
      exp: exp || Math.floor(Date.now() / 1000) + 100 * 24 * 60 * 60 // 100 days
    })
    return refresh_token
  }

  async signForgotPasswordToken({ user_id }: { user_id: string }) {
    const forgot_password_token = await signToken({
      user_id,
      token_type: process.env.JWT_FORGOT_PASSWORD_TOKEN
    })
    return forgot_password_token
  }

  async signAccessTokenAndRefreshToken({ user_id, role }: { user_id: string; role?: Role }) {
    return Promise.all([this.signAccessToken({ user_id, role }), this.signRefreshToken({ user_id, role })])
  }

  async register({ username, email, password }: Omit<UserRegisterBody, 'confirm_password'>) {
    const user = await databaseService.users.insertOne(new User({ username, email, password: hashPassword(password) }))
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user.insertedId.toString(),
      role: Role.User
    })

    return {
      access_token,
      refresh_token
    }
  }

  async login({ user_id, role }: { user_id: string; role: Role }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, role })
    await databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: user_id, token: refresh_token }))

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
  }

  async refreshToken({
    old_refresh_token,
    user_id,
    exp,
    role
  }: {
    old_refresh_token: string
    user_id: string
    exp: number
    role: Role
  }) {
    const refresh_token = await signToken({
      user_id,
      role,
      exp
    })

    const [access_token] = await Promise.all([
      this.signAccessToken({ user_id, role }),
      databaseService.refreshTokens.deleteOne({ token: old_refresh_token }),
      databaseService.refreshTokens.insertOne(new RefreshToken({ user_id, token: refresh_token }))
    ])

    return { access_token, refresh_token }
  }

  async updateUser({ payload, user_id }: { payload: UpdateUserBody; user_id: string }) {
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: payload,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return user.value
  }

  async getProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          forgot_password_token: 0,
          role: 0
        }
      }
    )

    return user
  }

  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id })

    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    const { username, email } = user.value as WithId<User>

    // Send email to user to request reset password
    // User click to button have link as http://localhost:3000/reset-password?token=forgot_password_token
    // Client will get forgot_password_token then send to server
    await sendEmailVerifyForgotPassword({ toAddress: email, forgot_password_token, username })
  }

  async resetPassword({ user_id, new_password }: { user_id: string; new_password: string }) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(new_password),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
}

const userService = new UserService()
export default userService
