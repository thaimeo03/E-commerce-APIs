import { ObjectId } from 'mongodb'
import { CartConstructor, ProductInfo } from '../interfaces/carts.interface'

export default class Cart {
  _id: ObjectId
  user_id: ObjectId
  products_added: ProductInfo[]
  created_at: Date
  updated_at: Date

  constructor(cart: CartConstructor) {
    const date = new Date()
    this._id = cart._id || new ObjectId()
    this.user_id = cart.user_id
    this.products_added = cart.products_added
    this.created_at = cart.created_at || date
    this.updated_at = cart.updated_at || date
  }
}
