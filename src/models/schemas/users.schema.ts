import Joi from 'joi'
import { LoginBody, UserRegisterBody } from '../interfaces/users.interface'
import { USER_MESSAGES } from '~/constants/messages'

export const registerSchema: Joi.PartialSchemaMap<any> = {
  username: Joi.string().required().min(1).max(50).messages({
    'string.empty': USER_MESSAGES.USERNAME_IS_REQUIRED,
    'string.min': USER_MESSAGES.USERNAME_MIN_LENGTH,
    'string.max': USER_MESSAGES.USERNAME_MAX_LENGTH
  }),
  email: Joi.string().email().required().messages({
    'string.empty': USER_MESSAGES.EMAIL_IS_REQUIRED,
    'string.email': USER_MESSAGES.EMAIL_IS_INVALID
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': USER_MESSAGES.PASSWORD_IS_REQUIRED,
    'string.min': USER_MESSAGES.PASSWORD_MIN_LENGTH
  }),
  confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': USER_MESSAGES.CONFIRM_PASSWORD_DO_NOT_MATCH
  })
}

export const registerUserSchema = Joi.object<UserRegisterBody>(registerSchema)

export const loginSchema = Joi.object<LoginBody>({
  email: Joi.string().email().required().messages({
    'string.empty': USER_MESSAGES.EMAIL_IS_REQUIRED,
    'string.email': USER_MESSAGES.EMAIL_IS_INVALID
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': USER_MESSAGES.PASSWORD_IS_REQUIRED,
    'string.min': USER_MESSAGES.PASSWORD_MIN_LENGTH
  })
})
