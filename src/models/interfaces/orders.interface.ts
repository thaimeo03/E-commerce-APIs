import { ObjectId } from 'mongodb'
import { ProductInfo } from './carts.interface'
import { OrderStatus } from '~/constants/enums'
import { Address } from './users.interface'

export interface OrderConstructor {
  _id?: ObjectId
  user_id: ObjectId
  product_info: ProductInfo
  order_status?: OrderStatus
  billing_address: Address
  receive_phone: string
  created_at?: Date
  updated_at?: Date
}

export interface OrderBody {
  product_info: ProductInfo
  billing_address: Address
  receive_phone: string
}
