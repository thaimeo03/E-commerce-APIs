import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { AdminRegisterBody } from '~/models/interfaces/users.interface'
import { registerAdminSchema } from '~/models/schemas/admins.schema'
import databaseService from '~/services/database.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const registerAdminValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await registerAdminSchema.validateAsync(req.body as AdminRegisterBody, { abortEarly: false })

  const { admin_secret_key, email } = value
  if (admin_secret_key !== process.env.ADMIN_SECRET_KEY) {
    throw new ErrorWithStatus({
      message: ADMIN_MESSAGES.ADMIN_SECRET_KEY_NOT_MATCH,
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

export const isAdminValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const role = req.decodedAccessToken?.role as Role

  if (role === Role.User) {
    throw new ErrorWithStatus({
      message: ADMIN_MESSAGES.ROLE_MUST_BE_ADMIN,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  if (role === Role.Banned) {
    throw new ErrorWithStatus({
      message: ADMIN_MESSAGES.ACCOUNT_IS_BANNED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})
