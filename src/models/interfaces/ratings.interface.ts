import { ObjectId } from 'mongodb'

export interface RatingConstructor {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  rating: number // 1 -> 5
  comment?: string
  created_at?: Date
}

export interface RatingBody {
  product_id: string
  rating: number // 1 -> 5
  comment?: string
}
