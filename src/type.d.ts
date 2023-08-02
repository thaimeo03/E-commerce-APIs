import { Request } from 'express'
import User from './models/database/User'
import jwt from 'jsonwebtoken'
import { Role } from './constants/enums'
import Product from './models/database/Product'
import Category from './models/database/Category'
import Order from './models/database/Order'

interface extendsJwtPayload extends jwt.JwtPayload {
  user_id?: string
  role?: Role
  token_type?: string | undefined
}

declare module 'express' {
  interface Request {
    user?: User
    decodedAccessToken?: extendsJwtPayload
    decodedRefreshToken?: extendsJwtPayload
    product?: Product
    category?: Category
    order?: Order
  }
}
