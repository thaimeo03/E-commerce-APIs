import { RatingBody, RatingQueries } from '~/models/interfaces/ratings.interface'
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

  async getRatingsByProductId(product_id: string, { limit, page, order }: RatingQueries) {
    const limit_query = Number(limit) || 5
    const page_query = Number(page) || 1
    const order_query = order === 'asc' ? 1 : -1

    const [ratings, total] = await Promise.all([
      await databaseService.ratings
        .aggregate([
          {
            $match: {
              product_id: new ObjectId(product_id)
            }
          },
          {
            $skip: (page_query - 1) * limit_query
          },
          {
            $limit: limit_query
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $project: {
              'user.email': 0,
              'user.password': 0,
              'user.forgot_password_token': 0,
              'user.role': 0,
              'user.addresses': 0,
              'user.phone': 0,
              'user.day_of_birth': 0,
              'user.created_at': 0,
              'user.updated_at': 0
            }
          },
          {
            $sort: {
              rating: order_query
            }
          }
        ])
        .toArray(),
      await databaseService.ratings.countDocuments({
        product_id: new ObjectId(product_id)
      })
    ])

    const total_page = Math.ceil(total / limit_query)

    return {
      ratings,
      total,
      pagination: {
        total_page,
        page: page_query,
        limit: limit_query
      }
    }
  }
}

const ratingService = new RatingService()
export default ratingService
