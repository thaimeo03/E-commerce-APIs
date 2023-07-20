import { ObjectId } from 'mongodb'
import { Status } from '~/constants/enums'

export interface Price {
  promotion: number // khuyến mãi, mặc định là 0
  regular: number
}

export interface ProductConstructor {
  _id?: ObjectId
  name: string
  main_image: string
  images?: string[] // có thể có vài image
  description?: string
  price: Price
  colors?: string[] // một product có thể có vài color
  quantity: number // có sẵn
  status?: Status
  sold?: number
  categories: string[] // chứa tên các loại sản phẩm nhau
  created_at?: Date
  updated_at?: Date
}

export interface ProductBody {
  name: string
  main_image: string // url
  images?: string[] // chứa các url
  description?: string
  price: Price
  colors?: string[] // một product có thể có vài color
  quantity: number // có sẵn
  status?: Status
  categories: string[] // chứa tên các loại sản phẩm nhau
}

export interface ProductQueries {
  page?: string
  limit?: string
  order?: 'desc' | 'asc'
  sort_by?: 'created_at' | 'sold' | 'price'
  // rating?: number
  name?: string
  category_id?: string
}
