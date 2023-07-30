import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import { ErrorValidator } from '~/models/res/ErrorCustom'

export const wrapHandler = (func: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
      next()
    } catch (err: any) {
      if (err instanceof Joi.ValidationError) {
        next(new ErrorValidator({ error: err.details }))
      }
      next(err)
    }
  }
}
