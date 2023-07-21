import { NextFunction, Request, Response } from 'express'
import { CART_MESSAGES } from '~/constants/messages'
import { ItemCartBody } from '~/models/interfaces/carts.interface'
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
