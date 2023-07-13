import { NextFunction, Request, Response } from 'express'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { wrapHandler } from '~/utils/wrapHandler'

export const registerAdminController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'ok' })
})
