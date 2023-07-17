import { NextFunction, Request, Response } from 'express'
import { CategoryBody } from '~/models/interfaces/categories.interface'
import { productCategorySchema } from '~/models/schemas/categories.schema'
import { wrapHandler } from '~/utils/wrapHandler'

export const categoryValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  await productCategorySchema.validateAsync(req.body as CategoryBody, { abortEarly: false })
})
