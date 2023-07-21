import { ObjectId } from 'mongodb'

export interface ProductInfo {
  product_id: ObjectId
  quantity: number
  color?: string
}

export interface CartConstructor {
  _id?: ObjectId
  user_id: ObjectId
  products_added: ProductInfo[]
  created_at?: Date
  updated_at?: Date
}

export interface ItemCartBody {
  product_id: string
  quantity: number
  color?: string
}
