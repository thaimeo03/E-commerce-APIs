import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import User from '~/models/database/User'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { loginSchema } from '~/models/schemas/users.schema'
import databaseService from '~/services/database.service'
import hashPassword from '~/utils/hash'
import { verifyToken } from '~/utils/jwt'
import { wrapHandler } from '~/utils/wrapHandler'

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

export const accessTokenValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.header('Authorization')

  if (!bearerToken) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FOBIDDEN,
      message: USER_MESSAGES.BEARER_TOKEN_IS_REQUIRED
    })
  }

  const access_token = bearerToken.split(' ')[1]
  if (!access_token) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FOBIDDEN,
      message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
    })
  }

  const decodedAccessToken = await verifyToken(access_token)
  req.decodedAccessToken = decodedAccessToken
})

export const refreshTokenValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refresh_token = req.body.refresh_token as string

  const [decodedRefreshToken, result] = await Promise.all([
    verifyToken(refresh_token),
    databaseService.refreshTokens.findOne({ token: refresh_token })
  ])

  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USER_MESSAGES.REFRESH_TOKEN_NOT_FOUND
    })
  }

  req.decodedRefreshToken = decodedRefreshToken
})