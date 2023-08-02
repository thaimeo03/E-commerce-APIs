import Joi from 'joi'
import { ProductsReportQuery } from '../interfaces/analytics.interface'
import { ANALYTIC_MESSAGES } from '~/constants/messages'

export const productsReportSchema = Joi.object<Omit<ProductsReportQuery, 'page' | 'limit' | 'name'>>({
  min_date: Joi.date().iso().messages({
    'date.iso': ANALYTIC_MESSAGES.INVALID_DATE
  }),
  max_date: Joi.date().iso().messages({
    'date.iso': ANALYTIC_MESSAGES.INVALID_DATE
  }),
  sort_by: Joi.string().valid('sold', 'revenue'),
  order: Joi.string().valid('asc', 'desc')
})
