import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import Product from '~/models/database/Product'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { CategoryBody } from '~/models/interfaces/categories.interface'
import { productCategorySchema } from '~/models/schemas/categories.schema'
import databaseService from '~/services/database.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const nameCategoryValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await productCategorySchema.validateAsync(req.body as CategoryBody, { abortEarly: false })
  const { name } = value

  const isExisted = await databaseService.categories.findOne({ name })
  if (isExisted) {
    throw new ErrorWithStatus({
      message: CATEGORY_MESSAGES.CATEGORY_ALREADY_EXIST,
      status: HTTP_STATUS.OK
    })
  }
})

export const nameRemoveProductFromCategoryValidator = wrapHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = await productCategorySchema.validateAsync(req.body as CategoryBody, { abortEarly: false })
    const { name } = value

    const category = await databaseService.categories.findOne({ name })
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const product = req.product as Product
    const { categories } = product
    const isProductInCategories = categories.includes(category.name)

    if (!isProductInCategories) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.PRODUCT_NOT_IN_CATEGORY,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
)

export const idCategoryValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category_id } = req.params
  const category = await databaseService.categories.findOne({ _id: new ObjectId(category_id) })
  if (!category) {
    throw new ErrorWithStatus({
      message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  req.category = category
})
