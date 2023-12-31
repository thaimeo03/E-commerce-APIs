import { NextFunction, Request, Response } from 'express'
import { CART_MESSAGES } from '~/constants/messages'
import { ItemCartBody, UpdateCartBody } from '~/models/interfaces/carts.interface'
import cartService from '~/services/carts.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const addToCardController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const payload = req.body as ItemCartBody
  const result = await cartService.addToCart({ user_id, payload })

  res.json({
    message: CART_MESSAGES.ADD_TO_CART_SUCCESSFULLY,
    result
  })
})

export const removeProductFromCartController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const product_id = req.params.product_id
  const result = await cartService.removeProductFromCart({ product_id, user_id })

  res.json({
    message: CART_MESSAGES.REMOVE_PRODUCT_FROM_CART_SUCCESSFULLY,
    result
  })
})

export const getCartListController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string

  const result = await cartService.getCartList(user_id)

  return res.json({
    message: CART_MESSAGES.GET_CART_LIST_SUCCESSFULLY,
    result
  })
})

export const updateCartController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const { products_added } = req.body as UpdateCartBody
  await cartService.updateCart({ user_id, payload: products_added })

  res.json({
    message: CART_MESSAGES.UPDATE_CART_SUCCESSFULLY
  })
})
