import { RatingBody } from '~/models/interfaces/ratings.interface'
import databaseService from './database.service'
import { ObjectId } from 'mongodb'
import Rating from '~/models/database/Rating'

class RatingService {
  async createRating({ user_id, payload }: { user_id: string; payload: RatingBody }) {
    const rating = await databaseService.ratings.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        product_id: new ObjectId(payload.product_id)
      },
      {
        $setOnInsert: new Rating({
          user_id: new ObjectId(user_id),
          ...payload,
          product_id: new ObjectId(payload.product_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    const ratings = await databaseService.ratings
      .find({
        product_id: new ObjectId(payload.product_id)
      })
      .toArray()

    const average_rating = ratings.reduce((a, b) => a + b.rating, 0) / ratings.length

    await databaseService.products.updateOne(
      {
        _id: new ObjectId(payload.product_id)
      },
      {
        $set: {
          average_rating
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return rating.value
  }
}

const ratingService = new RatingService()
export default ratingService
