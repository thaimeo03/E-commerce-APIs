import { Request } from 'express'
import User from './models/database/User'

declare module 'express' {
  interface Request {
    user?: User
  }
}
