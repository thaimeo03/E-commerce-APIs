import { ObjectId } from 'mongodb'

export interface RefreshTokenConstructor {
  _id?: ObjectId
  user_id: string
  token: string
  created_at?: Date
}

export interface RefreshTokenBody {
  user_id: string
  token: string
}
