import { NextFunction, Request, Response } from 'express'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import Product from '~/models/database/Product'
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

export const deleteProductController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = req.product as Product
  await productService.deleteProduct(product)

  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESSFULLY
  })
})

export const removeProductFromCategoryController = wrapHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = req.product as Product
    const name = req.body.name as string

    await productService.removeProductFromCategory({ product, name })

    return res.json({
      message: PRODUCT_MESSAGES.REMOVE_PRODUCT_FROM_CATEGORY_SUCCESSFULLY
    })
  }
)
