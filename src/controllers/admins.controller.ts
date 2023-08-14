import { NextFunction, Request, Response } from 'express'
import { ADMIN_MESSAGES } from '~/constants/messages'
import adminService from '~/services/admins.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const registerAdminController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body as { username: string; email: string; password: string }
  const result = await adminService.registerAdmin({ username, email, password })

  res.json({
    message: ADMIN_MESSAGES.REGISTER_ADMIN_SUCCESSFULLY,
    result
  })
})

export const banUserController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params
  await adminService.banUser(user_id)

  return res.json({
    message: ADMIN_MESSAGES.BAN_USER_SUCCESSFULLY
  })
})

export const unbannedUserController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params
  await adminService.unbannedUser(user_id)

  return res.json({
    message: ADMIN_MESSAGES.UNBANNED_USER_SUCCESSFULLY
  })
})
