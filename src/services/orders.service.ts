import { OrderBody } from '~/models/interfaces/orders.interface'
import databaseService from './database.service'
import Order from '~/models/database/Order'
import { ObjectId, WithId } from 'mongodb'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/messages'
import { Address } from '~/models/interfaces/users.interface'
import { OrderStatus } from '~/constants/enums'
import Product from '~/models/database/Product'

class OrderService {
  async orderOneProduct({ user_id, payload }: { user_id: string; payload: OrderBody }) {
    const [order, product] = await Promise.all([
      await databaseService.orders.insertOne(
        new Order({
          user_id: new ObjectId(user_id),
          ...payload,
          product_info: {
            ...payload.product_info,
            product_id: new ObjectId(payload.product_info.product_id),
            color: payload.product_info.color || ''
          }
        })
      ),
      (await databaseService.products.findOne({
        _id: new ObjectId(payload.product_info.product_id)
      })) as WithId<Product>
    ])

    // Calculate total price
    const total_price =
      payload.product_info.quantity * (product.price.promotion !== 0 ? product.price.promotion : product.price.regular)

    return {
      order_id: order.insertedId,
      total_price
    }
  }

  async orderManyProducts({
    user_id,
    billing_address,
    receive_phone
  }: {
    user_id: string
    billing_address: Address
    receive_phone: string
  }) {
    const cart = await databaseService.carts.findOne({ user_id: new ObjectId(user_id) })

    if (!cart || cart.products_added.length === 0) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.CART_MUST_HAVE_AT_LEAST_ONE_PRODUCT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const orders = await Promise.all(
      cart.products_added.map(async (product) => {
        const order = await this.orderOneProduct({
          user_id,
          payload: {
            product_info: {
              ...product,
              product_id: product.product_id.toString()
            },
            billing_address,
            receive_phone
          }
        })
        return order
      })
    )
    // Clear cart user
    await databaseService.carts.updateOne(
      { user_id: new ObjectId(user_id) },
      { $set: { products_added: [] }, $currentDate: { updated_at: true } }
    )

    // Calculate total price
    const total_price = orders.reduce((total, order) => total + order.total_price, 0)

    return {
      orders,
      total_price
    }
  }

  async changeOrderStatus({ order_id, order_status }: { order_id: string; order_status: OrderStatus }) {
    const order = (await databaseService.orders.findOne({ _id: new ObjectId(order_id) })) as WithId<Order>

    if (order.order_status !== OrderStatus.Completed && order_status === OrderStatus.Completed) {
      await databaseService.orders.updateOne(
        { _id: new ObjectId(order_id) },
        { $set: { order_status }, $currentDate: { updated_at: true } }
      )

      const sold = await databaseService.orders.countDocuments({
        order_status: OrderStatus.Completed,
        'product_info.product_id': order.product_info.product_id
      })
      await databaseService.products.updateOne(
        {
          _id: order.product_info.product_id
        },
        {
          $set: {
            sold
          },
          $inc: {
            quantity: -1
          }
        }
      )
    } else if (order.order_status === OrderStatus.Completed && order_status !== OrderStatus.Completed) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.CHANGE_ORDER_STATUS_FAILED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    } else if (order.order_status !== OrderStatus.Completed && order_status !== OrderStatus.Completed) {
      await databaseService.orders.updateOne(
        { _id: new ObjectId(order_id) },
        { $set: { order_status }, $currentDate: { updated_at: true } }
      )
    }
  }

  async getOrderInfo(order_id: string) {
    const res = await databaseService.orders
      .aggregate([
        {
          $match: {
            _id: new ObjectId(order_id)
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
                    '$product_info.product.price.regular',
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
            'product_info.product.status': 0,
            'product_info.product.sold': 0,
            'product_info.product.average_rating': 0,
            'product_info.product.description': 0,
            'product_info.product.colors': 0,
            'product_info.product.categories': 0,
            'product_info.product.updated_at': 0,
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
        }
      ])
      .toArray()

    return res
  }
}

const orderService = new OrderService()
export default orderService
