import { NextFunction, Request, Response } from 'express'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import { ProductBody } from '~/models/interfaces/products.interface'
import productService from '~/services/products.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const addProductController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body as ProductBody
  await productService.addProduct(payload)

  return res.json({
    message: PRODUCT_MESSAGES.ADD_PRODUCT_SUCCESSFULLY
  })
})
