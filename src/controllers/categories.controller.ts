import { NextFunction, Request, Response } from 'express'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import { CategoryBody } from '~/models/interfaces/categories.interface'
import categoryService from '~/services/categories.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const categoryController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body as CategoryBody
  await categoryService.createCategory(name)

  res.json({
    message: CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESSFULLY
  })
})
