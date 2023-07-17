import { ObjectId } from 'mongodb'
import { CategoryConstructor } from '../interfaces/categories.interface'

export default class Category {
  _id: ObjectId
  name: string
  created_at: Date
  updated_at: Date

  constructor(category: CategoryConstructor) {
    const date = new Date()
    this._id = category._id || new ObjectId()
    this.name = category.name
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
