import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Status } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { CART_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import { ItemCartBody, UpdateCartBody } from '~/models/interfaces/carts.interface'
import { addToCartSchema, updateCartSchema } from '~/models/schemas/carts.schema'
import databaseService from '~/services/database.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const checkProductInfo = async (value: ItemCartBody) => {
  const { product_id, quantity, color } = value

  const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })
  if (!product) {
    throw new ErrorWithStatus({
      message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  if (product.status === Status.OutStock) {
    throw new ErrorWithStatus({
      message: CART_MESSAGES.OUT_OF_STOCK,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  if (quantity > product.quantity) {
    throw new ErrorWithStatus({
      message: CART_MESSAGES.QUANTITY_LIMIT,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  if (color) {
    if (!product.colors.includes(color)) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.PRODUCT_NOT_FOUND_OR_OUT_OF_STOCK,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
}

export const addToCardValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await addToCartSchema.validateAsync(req.body as ItemCartBody, { abortEarly: false })
  await checkProductInfo(value)
})

export const updateCartValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const value = await updateCartSchema.validateAsync(req.body as UpdateCartBody, { abortEarly: false })
  const user_id = req.decodedAccessToken?.user_id as string
  const { products_added } = value

  // Check product_id each item
  await Promise.all(
    products_added.map(async (item) => {
      await checkProductInfo(item)
    })
  )

  const cart = await databaseService.carts.findOne({ user_id: new ObjectId(user_id) })
  if (cart?.products_added.length !== products_added.length) {
    throw new ErrorWithStatus({
      message: CART_MESSAGES.CART_LISt_NOT_MATCH,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})
