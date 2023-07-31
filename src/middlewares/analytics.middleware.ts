import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ANALYTIC_MESSAGES } from '~/constants/messages'
import { DateQuery } from '~/models/interfaces/analytics.interface'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import { wrapHandler } from '~/utils/wrapHandler'

export const dateValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { day, month, year } = req.query as DateQuery

  if (day) {
    const num = Number(day)
    if (num < 1 || num > 31) {
      throw new ErrorWithStatus({
        message: ANALYTIC_MESSAGES.INVALID_DAY,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  if (month) {
    const num = Number(month)
    if (num < 1 || num > 12) {
      throw new ErrorWithStatus({
        message: ANALYTIC_MESSAGES.INVALID_MONTH,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  if (year) {
    const num = Number(year)
    const date = new Date().getFullYear()
    if (num < date - 2 || num > date) {
      throw new ErrorWithStatus({
        message: ANALYTIC_MESSAGES.INVALID_YEAR,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }
})
