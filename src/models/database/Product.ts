import { ObjectId } from 'mongodb'
import { Price, ProductConstructor } from '../interfaces/products.interface'
import { Status } from '~/constants/enums'

export default class Product {
  _id: ObjectId
  name: string
  main_image: string
  images: string[] // có thể có vài image
  description: string
  price: Price
  colors: string[] // một product có thể có vài color
  quantity: number // có sẵn
  status: Status
  sold: number
  average_rating: number
  categories: string[] // chứa tên các loại sản phẩm nhau
  created_at: Date
  updated_at: Date

  constructor(product: ProductConstructor) {
    const date = new Date()
    this._id = product._id || new ObjectId()
    this.name = product.name
    this.main_image = product.main_image
    this.images = product.images || []
    this.description = product.description || ''
    this.price = product.price
    this.colors = product.colors || []
    this.quantity = product.quantity
    this.status = product.status || Status.InStock
    this.sold = product.sold || 0
    this.average_rating = 0
    this.categories = product.categories
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}
