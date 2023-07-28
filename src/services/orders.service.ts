import { OrderBody } from '~/models/interfaces/orders.interface'
import databaseService from './database.service'
import Order from '~/models/database/Order'
import { ObjectId, WithId } from 'mongodb'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/messages'
import { Address } from '~/models/interfaces/users.interface'
import { OrderStatus } from '~/constants/enums'

class OrderService {
  async orderOneProduct({ user_id, payload }: { user_id: string; payload: OrderBody }) {
    const order = await databaseService.orders.insertOne(
      new Order({
        user_id: new ObjectId(user_id),
        ...payload,
        product_info: {
          ...payload.product_info,
          product_id: new ObjectId(payload.product_info.product_id),
          color: payload.product_info.color || ''
        }
      })
    )

    return order.insertedId
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

    return orders
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
    }
  }
}

const orderService = new OrderService()
export default orderService
