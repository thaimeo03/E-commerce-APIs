import { Router } from 'express'
import {
  getAnalyticsOverviewController,
  getProductsReportController,
  transactionController
} from '~/controllers/analytics.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { dateValidator, getProductsReportValidator, transactionValidator } from '~/middlewares/analytics.middleware'
import { orderIdValidator } from '~/middlewares/orders.middleware'
import { paginationValidator } from '~/middlewares/products.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const analyticsRouter = Router()

// Overview report
// Header: access_token
// Query: year (report months of the year), month (report day of the month), day (report the day)
analyticsRouter.get('/overview', accessTokenValidator, isAdminValidator, dateValidator, getAnalyticsOverviewController)

// Transaction report
// Header: access_token
// Query: order_id, order_status, email
analyticsRouter.get(
  '/transaction',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  transactionValidator,
  transactionController
)

// Products report
// Header: access_token
// Query: min_date, max_date, name, sort_by: 'sold' | 'revenue', order: 'asc' | 'desc', page, limit
analyticsRouter.get(
  '/products',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  getProductsReportValidator,
  getProductsReportController
)

export default analyticsRouter
