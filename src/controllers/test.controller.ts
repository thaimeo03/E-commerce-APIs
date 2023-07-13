import { NextFunction, Request, Response } from 'express'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'

export const testController = async (req: Request, res: Response, next: NextFunction) => {
  throw new ErrorWithStatus({ message: 'test', status: 400 })
}
