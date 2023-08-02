import { DateQuery, ProductsReportQuery, TransactionQuery } from '~/models/interfaces/analytics.interface'
import databaseService from './database.service'
import { ObjectId } from 'mongodb'

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

  async transaction({ order_id, order_status, email, page, limit }: TransactionQuery) {
    const page_query = Number(page) || 1
    const limit_query = Number(limit) || 10
    const order_id_query = order_id ? { _id: new ObjectId(order_id) } : undefined
    const email_query = email ? { 'user.email': email } : undefined
    const order_status_query = order_status ? { order_status: Number(order_status) } : undefined

    const [transaction, total] = await Promise.all([
      await databaseService.orders
        .aggregate([
          {
            $match: {
              ...order_id_query,
              ...order_status_query
            }
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
            $addFields: {
              'product_info.total_price': {
                $multiply: [
                  '$product_info.quantity',
                  {
                    $cond: [
                      {
                        $eq: ['$product_info.product.price.promotion', 0]
                      },
                      1,
                      '$product_info.product.price.promotion'
                    ]
                  }
                ]
              }
            }
          },
          {
            $project: {
              user_id: 0,
              'product_info.product_id': 0,
              'product_info.product.quantity': 0,
              'product_info.product.images': 0,
              'product_info.product.price': 0,
              'product_info.product.created_at': 0,
              'product_info.product.status': 0,
              'product_info.product.sold': 0,
              'product_info.product.average_rating': 0,
              'product_info.product.description': 0,
              'product_info.product.colors': 0,
              'product_info.product.categories': 0,
              'product_info.product.updated_at': 0,
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
            $match: {
              ...email_query
            }
          },
          {
            $skip: (page_query - 1) * limit_query
          },
          {
            $limit: limit_query
          }
        ])
        .toArray(),
      await databaseService.orders
        .aggregate([
          {
            $match: {
              ...order_id_query,
              ...order_status_query
            }
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
            $addFields: {
              'product_info.total_price': {
                $multiply: [
                  '$product_info.quantity',
                  {
                    $cond: [
                      {
                        $eq: ['$product_info.product.price.promotion', 0]
                      },
                      1,
                      '$product_info.product.price.promotion'
                    ]
                  }
                ]
              }
            }
          },
          {
            $project: {
              user_id: 0,
              'product_info.product_id': 0,
              'product_info.product.quantity': 0,
              'product_info.product.images': 0,
              'product_info.product.price': 0,
              'product_info.product.created_at': 0,
              'product_info.product.status': 0,
              'product_info.product.sold': 0,
              'product_info.product.average_rating': 0,
              'product_info.product.description': 0,
              'product_info.product.colors': 0,
              'product_info.product.categories': 0,
              'product_info.product.updated_at': 0,
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
            $match: {
              ...email_query
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    const total_page = Math.ceil(total[0]?.total / limit_query) || 0
    return {
      transaction,
      pagination: {
        total_page,
        page: page_query,
        limit: limit_query
      }
    }
  }

  async getProductsReport({ min_date, max_date, name, sort_by, order, page, limit }: ProductsReportQuery) {
    const min_date_query = min_date ? { created_at: { $gte: new Date(min_date) } } : undefined
    const max_date_query = max_date ? { created_at: { $lte: new Date(max_date) } } : undefined
    const name_query = name ? { 'product.name': { $regex: name } } : undefined
    const page_query = Number(page) || 1
    const limit_query = Number(limit) || 10
    const order_by_query = order === 'asc' ? 1 : -1
    const sort_by_query = sort_by ? { [sort_by]: order_by_query } : { sold: order_by_query }

    const [products, total] = await Promise.all([
      await databaseService.orders
        .aggregate([
          {
            $match: {
              ...min_date_query,
              ...max_date_query
            }
          },
          {
            $group: {
              _id: '$product_info.product_id',
              sold: {
                $sum: '$product_info.quantity'
              }
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: '_id',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $unwind: {
              path: '$product'
            }
          },
          {
            $addFields: {
              revenue: {
                $multiply: ['$sold', '$product.price.promotion']
              }
            }
          },
          {
            $match: {
              ...name_query
            }
          },
          {
            $skip: (page_query - 1) * limit_query
          },
          {
            $limit: limit_query
          },
          {
            $project: {
              sold: 1,
              revenue: 1,
              status: '$product.status',
              name: '$product.name',
              image: '$product.main_image',
              average_rating: '$product.average_rating'
            }
          },
          {
            $sort: {
              ...sort_by_query
            }
          }
        ])
        .toArray(),
      await databaseService.orders
        .aggregate([
          {
            $match: {
              ...min_date_query,
              ...max_date_query
            }
          },
          {
            $group: {
              _id: '$product_info.product_id',
              sold: {
                $sum: '$product_info.quantity'
              }
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: '_id',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $unwind: {
              path: '$product'
            }
          },
          {
            $addFields: {
              revenue: {
                $multiply: ['$sold', '$product.price.promotion']
              }
            }
          },
          {
            $match: {
              ...name_query
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    const total_page = Math.ceil(total[0]?.total / limit_query) || 0

    return {
      products,
      pagination: {
        total_page,
        page: page_query,
        limit: limit_query
      }
    }
  }
}

const analyticService = new AnalyticService()
export default analyticService
