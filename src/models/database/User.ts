import { ObjectId } from 'mongodb'
import { Address, UserConstructor } from '../interfaces/users.interface'
import { Role } from '~/constants/enums'

export default class User {
  _id: ObjectId
  username: string
  email: string
  password: string
  forgot_password_token: string
  role?: Role

  addresses: Address[] // một user có thể có vài địa chỉ
  phone: number[] // một có thể có vài địa chỉ
  avatar: string
  day_of_birth: Date
  created_at: Date
  updated_at: Date

  constructor(user: UserConstructor) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.username = user.username
    this.email = user.email
    this.password = user.password
    this.forgot_password_token = user.forgot_password_token || ''
    this.role = user.role || Role.User

    this.addresses = user.addresses || []
    this.phone = user.phone || []
    this.avatar = user.avatar || ''
    this.day_of_birth = user.day_of_birth || date
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
