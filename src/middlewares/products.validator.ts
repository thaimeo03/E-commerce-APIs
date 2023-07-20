import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { ProductBody, ProductQueries } from '~/models/interfaces/products.interface'
import { addProductSchema } from '~/models/schemas/products.schema'
import databaseService from '~/services/database.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const addProductValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await addProductSchema.validateAsync(req.body as ProductBody, { abortEarly: false })

  if (value.price.regular < 0 || value.price.promotion < 0 || value.quantity < 0) {
    throw new ErrorWithStatus({
      message: PRODUCT_MESSAGES.PRICE_AND_QUANTITY_MUST_BE_POSITIVE,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const { categories } = value
  if (categories.length === 0) {
    throw new ErrorWithStatus({
      message: PRODUCT_MESSAGES.CATEGORY_MUST_BE_SELECTED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})

export const idProductValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })
  if (!product) {
    throw new ErrorWithStatus({
      message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  req.product = product
})

export const getProductsValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category_id, page, limit, order, sort_by } = req.query as ProductQueries

  if (category_id) {
    if (!ObjectId.isValid(category_id)) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const category = await databaseService.categories.findOne({ _id: new ObjectId(category_id) })
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    req.category = category
  }

  if (page) {
    const num = Number(page)
    if (num < 1) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_PAGE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  if (limit) {
    const num = Number(limit)
    if (num < 1 || num > 100) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_LIMIT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  if (order) {
    if (order !== 'asc' && order !== 'desc') {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_ORDER,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  if (sort_by) {
    if (sort_by !== 'created_at' && sort_by !== 'sold' && sort_by !== 'price') {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_SORT_BY,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }
})
