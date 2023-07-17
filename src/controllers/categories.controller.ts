import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import { CategoryBody } from '~/models/interfaces/categories.interface'
import categoryService from '~/services/categories.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const createCategoryController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body as CategoryBody
  await categoryService.createCategory(name)

  return res.status(HTTP_STATUS.CREATED).json({
    message: CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESSFULLY
  })
})

export const deleteCategoryController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category_id } = req.params
  await categoryService.deleteCategory(category_id)

  return res.json({
    message: CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESSFULLY
  })
})

export const updateCategoryController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body as CategoryBody
  const result = await categoryService.updateCategory(name)

  return res.json({
    message: CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESSFULLY,
    result
  })
})
