import { ObjectId } from 'mongodb'
import userService from './users.service'
import databaseService from './database.service'
import User from '~/models/database/User'
import hashPassword from '~/utils/hash'
import { Role } from '~/constants/enums'
import RefreshToken from '~/models/database/RefreshToken'

class AdminService {
  async registerAdmin(payload: { username: string; email: string; password: string }) {
    const _id = new ObjectId()
    const [_, token] = await Promise.all([
      await databaseService.users.insertOne(
        new User({
          ...payload,
          password: hashPassword(payload.password),
          _id,
          role: Role.Admin
        })
      ),
      userService.signAccessTokenAndRefreshToken({ user_id: _id.toString(), role: Role.Admin })
    ])
    const [access_token, refresh_token] = token
    await databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: _id.toString(), token: refresh_token }))

    return { access_token, refresh_token }
  }

  async banUser(user_id: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          role: Role.Banned
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

  async unbannedUser(user_id: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          role: Role.User
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
}

const adminService = new AdminService()
export default adminService
