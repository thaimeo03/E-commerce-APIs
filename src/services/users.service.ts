import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import User from '~/models/database/User'
import { Role } from '~/constants/enums'
import hashPassword from '~/utils/hash'
import { signToken } from '~/utils/jwt'
import 'dotenv/config'
import RefreshToken from '~/models/database/RefreshToken'

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

  async registerAdmin(payload: { username: string; email: string; password: string }) {
    const _id = new ObjectId()
    const forgot_password_token = await this.signForgotPasswordToken({ user_id: _id.toString() })
    const [_, token] = await Promise.all([
      await databaseService.users.insertOne(
        new User({
          ...payload,
          password: hashPassword(payload.password),
          _id,
          role: Role.Admin,
          forgot_password_token
        })
      ),
      this.signAccessTokenAndRefreshToken({ user_id: _id.toString(), role: Role.Admin })
    ])
    const [access_token, refresh_token] = token
    await databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: _id.toString(), token: refresh_token }))

    return { access_token, refresh_token }
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
}

const userService = new UserService()
export default userService
