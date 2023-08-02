import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ANALYTIC_MESSAGES } from '~/constants/messages'
import { DateQuery, ProductsReportQuery, TransactionQuery } from '~/models/interfaces/analytics.interface'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import { productsReportSchema } from '~/models/schemas/analytics.schema'
import databaseService from '~/services/database.service'
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

export const transactionValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order_id, order_status, email } = req.query as TransactionQuery

  if (order_id) {
    const order = await databaseService.orders.findOne({ _id: new ObjectId(order_id) })

    if (!order) {
      throw new ErrorWithStatus({
        message: ANALYTIC_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }

  if (order_status) {
    const status = Number(order_status)
    if (!Object.values(OrderStatus).includes(status)) {
      throw new ErrorWithStatus({
        message: ANALYTIC_MESSAGES.INVALID_ORDER_STATUS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  if (email) {
    const user = await databaseService.users.findOne({ email })
    if (!user) {
      throw new ErrorWithStatus({
        message: ANALYTIC_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
})

export const getProductsReportValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { min_date, max_date, sort_by, order } = req.query as ProductsReportQuery

  await productsReportSchema.validateAsync({ min_date, max_date, sort_by, order }, { abortEarly: false })
})
