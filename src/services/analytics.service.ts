import { DateQuery } from '~/models/interfaces/analytics.interface'
import databaseService from './database.service'

class AnalyticService {
  async getAnalytics({ day, month, year }: DateQuery) {
    const dayTarget = Number(day) || 1
    const monthTarget = Number(month) || 1
    const yearTarget = Number(year) || new Date().getFullYear()

    const dateMin = new Date(yearTarget, monthTarget - 1, dayTarget)
    let dateMax: Date
    if (!day && !month) {
      dateMax = new Date(yearTarget + 1, monthTarget - 1, dayTarget)
    } else if (!day) {
      dateMax = new Date(yearTarget, monthTarget, dayTarget)
    } else {
      dateMax = new Date(yearTarget, monthTarget - 1, dayTarget + 1)
    }

    const dayQuery = day
      ? {
          day: {
            $dayOfMonth: '$created_at'
          }
        }
      : undefined

    const result = await databaseService.orders
      .aggregate([
        {
          $match: {
            order_status: 2,
            created_at: {
              $gte: dateMin,
              $lt: dateMax
            }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_info.product_id',
            foreignField: '_id',
            as: 'product_info.product'
          }
        },
        {
          $unwind: {
            path: '$product_info.product'
          }
        },
        {
          $project: {
            product_info: 1,
            created_at: 1
          }
        },
        {
          $addFields: {
            'product_info.total_price': {
              $multiply: [
                '$product_info.quantity',
                {
                  $cond: [
                    {
                      $eq: ['$product_info.product.price.promotion', 0]
                    },
                    '$product_info.product.price.regular',
                    '$product_info.product.price.promotion'
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              month: {
                $month: '$created_at'
              },
              year: {
                $year: '$created_at'
              },
              ...dayQuery
            },
            order_quantity: {
              $sum: 1
            },
            sold_quantity: {
              $sum: '$product_info.quantity'
            },
            revenue: {
              $sum: '$product_info.total_price'
            }
          }
        }
      ])
      .toArray()

    return result
  }
}

const analyticService = new AnalyticService()
export default analyticService
