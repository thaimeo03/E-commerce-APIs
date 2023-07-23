import { ObjectId } from 'mongodb'
import { ProductInfo } from '../interfaces/carts.interface'
import { OrderStatus } from '~/constants/enums'
import { Address } from '../interfaces/users.interface'
import { OrderConstructor } from '../interfaces/orders.interface'

export default class Order {
  _id: ObjectId
  user_id: ObjectId
  product_info: ProductInfo
  order_status: OrderStatus
  billing_address: Address
  receive_phone: string
  created_at: Date
  updated_at: Date

  constructor(order: OrderConstructor) {
    const date = new Date()
    this._id = order._id || new ObjectId()
    this.user_id = order.user_id
    this.product_info = order.product_info
    this.order_status = order.order_status || OrderStatus.Pending
    this.billing_address = order.billing_address
    this.receive_phone = order.receive_phone
    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}
