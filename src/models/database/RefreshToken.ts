import { ObjectId } from 'mongodb'
import { RefreshTokenConstructor } from '../interfaces/refreshTokens.interface'

export default class RefreshToken {
  _id: ObjectId
  user_id: ObjectId
  token: string
  created_at: Date

  constructor(refreshToken: RefreshTokenConstructor) {
    this._id = refreshToken._id || new ObjectId()
    this.user_id = new ObjectId(refreshToken.user_id)
    this.token = refreshToken.token
    this.created_at = refreshToken.created_at || new Date()
  }
}
