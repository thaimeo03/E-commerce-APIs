import { ObjectId } from 'mongodb'
import { RatingConstructor } from '../interfaces/ratings.interface'

export default class Rating {
  _id: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  rating: number // 1 -> 5
  comment: string
  created_at: Date

  constructor(rating: RatingConstructor) {
    this._id = rating._id || new ObjectId()
    this.user_id = rating.user_id
    this.product_id = rating.product_id
    this.rating = rating.rating
    this.comment = rating.comment || ''
    this.created_at = rating.created_at || new Date()
  }
}
