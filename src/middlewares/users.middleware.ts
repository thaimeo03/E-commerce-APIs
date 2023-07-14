import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import User from '~/models/database/User'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { AdminRegisterBody } from '~/models/interfaces/users.interface'
import { loginSchema, registerAdminSchema } from '~/models/schemas/users.shema'
import databaseService from '~/services/database.service'
import hashPassword from '~/utils/hash'
import { wrapHandler } from '~/utils/wrapHandler'

export const registerAdminValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await registerAdminSchema.validateAsync(req.body as AdminRegisterBody, { abortEarly: false })

  const { admin_secret_key, email } = value
  if (admin_secret_key !== process.env.ADMIN_SECRET_KEY) {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.ADMIN_SECRET_KEY_NOT_MATCH,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY
    })
  }

  const user = await databaseService.users.findOne({ email })
  if (user !== null) {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.EMAIL_ALREADY_EXIST,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})

export const loginValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await loginSchema.validateAsync(req.body, { abortEarly: false })

  const { email, password } = value
  const user = await databaseService.users.findOne({ email, password: hashPassword(password) })
  if (!user) {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  req.user = user as User
})
