import Joi from 'joi'
import { AdminRegisterBody } from '../interfaces/users.interface'
import { registerSchema } from './users.schema'
import { USER_MESSAGES } from '~/constants/messages'

export const registerAdminSchema = Joi.object<AdminRegisterBody>({
  ...registerSchema,
  admin_secret_key: Joi.string().required().messages({
    'string.empty': USER_MESSAGES.ADMIN_SECRET_KEY_IS_REQUIRED
  })
})
