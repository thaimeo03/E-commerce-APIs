import { NextFunction, Request, Response } from 'express'
import { ANALYTIC_MESSAGES } from '~/constants/messages'
import { DateQuery } from '~/models/interfaces/analytics.interface'
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
