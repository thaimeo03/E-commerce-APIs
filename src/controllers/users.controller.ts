import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/enums'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import userService from '~/services/users.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const registerAdminController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body as { username: string; email: string; password: string }
  const result = await userService.registerAdmin({ username, email, password })

  res.json({
    message: USER_MESSAGES.REGISTER_ADMIN_SUCCESSFULLY,
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
