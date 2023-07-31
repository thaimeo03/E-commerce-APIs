import { Router } from 'express'
import { getAnalyticsOverviewController } from '~/controllers/analytics.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { dateValidator } from '~/middlewares/analytics.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const analyticsRouter = Router()

// Overview report
// Header: access_token
// Query: year (report months of the year), month (report day of the month), day (report the day)
analyticsRouter.get('/overview', accessTokenValidator, isAdminValidator, dateValidator, getAnalyticsOverviewController)

export default analyticsRouter
