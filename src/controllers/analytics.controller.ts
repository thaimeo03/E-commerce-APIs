import { NextFunction, Request, Response } from 'express'
import { ANALYTIC_MESSAGES } from '~/constants/messages'
import { DateQuery, TransactionQuery } from '~/models/interfaces/analytics.interface'
import analyticService from '~/services/analytics.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const getAnalyticsOverviewController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { day, month, year } = req.query as DateQuery

  const result = await analyticService.getAnalytics({ day, month, year })

  return res.json({
    message: ANALYTIC_MESSAGES.GET_ANALYTICS_OVERVIEW_SUCCESSFULLY,
    result
  })
})

export const transactionController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order_id, order_status, email, page, limit } = req.query as TransactionQuery

  const result = await analyticService.transaction({ order_id, order_status, email, page, limit })

  return res.json({
    message: ANALYTIC_MESSAGES.GET_TRANSACTION_SUCCESSFULLY,
    result
  })
})
