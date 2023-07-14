import { Request } from 'express'
import User from './models/database/User'
import jwt from 'jsonwebtoken'

declare module 'express' {
  interface Request {
    user?: User
    decodedAccessToken?: jwt.JwtPayload
    decodedRefreshToken?: jwt.JwtPayload
  }
}
