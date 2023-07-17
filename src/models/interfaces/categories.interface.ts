import { ObjectId } from 'mongodb'

export interface CategoryConstructor {
  _id?: ObjectId
  name: string
  created_at?: Date
  updated_at?: Date
}

export interface CategoryBody {
  name: string
}
