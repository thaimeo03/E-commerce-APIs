import { ObjectId } from 'mongodb'
import { Role } from '~/constants/enums'

export interface Address {
  street: string
  city: string
}

export interface UserConstructor {
  _id?: ObjectId
  username: string
  email: string
  password: string
  forgot_password_token?: string
  role?: Role

  addresses?: Address[] // một user có thể có vài địa chỉ
  phone?: number[] // một có thể có vài địa chỉ
  avatar?: string
  day_of_birth?: Date
  created_at?: Date
  updated_at?: Date
}

export interface UserRegisterBody {
  username: string
  email: string
  password: string
  confirm_password: string
}

export interface AdminRegisterBody {
  username: string
  email: string
  password: string
  confirm_password: string
  admin_secret_key: string
}
