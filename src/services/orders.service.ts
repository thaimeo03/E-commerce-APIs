import { OrderBody } from '~/models/interfaces/orders.interface'
import databaseService from './database.service'
import Order from '~/models/database/Order'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/messages'
import { Address } from '~/models/interfaces/users.interface'
import { OrderStatus } from '~/constants/enums'

class OrderService {
  async orderOneProduct({ user_id, payload }: { user_id: string; payload: OrderBody }) {
    const order = await databaseService.orders.insertOne(new Order({ user_id: new ObjectId(user_id), ...payload }))

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
            product_info: product,
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
    await databaseService.orders.updateOne(
      { _id: new ObjectId(order_id) },
      { $set: { order_status }, $currentDate: { updated_at: true } }
    )
  }
}

const orderService = new OrderService()
export default orderService
