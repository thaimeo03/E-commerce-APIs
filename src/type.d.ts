import { Request } from 'express'
import User from './models/database/User'
import jwt from 'jsonwebtoken'
import { Role } from './constants/enums'

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
  }
}
