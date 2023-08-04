import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/enums'
import { USER_MESSAGES } from '~/constants/messages'
import { UpdateUserBody, UserRegisterBody } from '~/models/interfaces/users.interface'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import userService from '~/services/users.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const registerController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body as UserRegisterBody

  const result = await userService.register({ username, email, password })

  return res.json({
    message: USER_MESSAGES.REGISTER_SUCCESSFULLY,
    result
  })
})

export const loginController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user?._id.toString() as string
  const role = req.user?.role as Role
  const result = await userService.login({ user_id, role })

  res.json({
    message: USER_MESSAGES.LOGIN_SUCCESSFULLY,
    result
  })
})

export const logoutController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refresh_token = req.body.refresh_token as string

  await userService.logout(refresh_token)

  res.json({
    message: USER_MESSAGES.LOGOUT_SUCCESSFULLY
  })
})

export const refreshTokenController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const old_refresh_token = req.body.refresh_token as string
  const user_id = req.decodedRefreshToken?.user_id as string
  const exp = req.decodedRefreshToken?.exp as number
  const role = req.decodedRefreshToken?.role as Role

  const result = await userService.refreshToken({ old_refresh_token, user_id, exp, role })

  res.json({
    message: USER_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY,
    result
  })
})

export const updateUserController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const payload = req.body as UpdateUserBody

  const result = await userService.updateUser({ payload, user_id })

  return res.json({
    message: USER_MESSAGES.UPDATE_USER_SUCCESSFULLY,
    result
  })
})
