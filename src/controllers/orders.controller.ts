import { NextFunction, Request, Response } from 'express'
import { ORDER_MESSAGES } from '~/constants/messages'
import { OrderBody } from '~/models/interfaces/orders.interface'
import orderService from '~/services/orders.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const orderOneProductController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const payload = req.body as OrderBody

  const result = await orderService.orderOneProduct({ user_id, payload })

  return res.json({
    message: ORDER_MESSAGES.ORDER_PRODUCT_SUCCESSFULLY,
    result: {
      code_bill: result
    }
  })
})

export const orderManyProductsController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const { billing_address, receive_phone } = req.body as Omit<OrderBody, 'product_info'>

  const result = await orderService.orderManyProducts({ user_id, billing_address, receive_phone })

  return res.json({
    message: ORDER_MESSAGES.ORDER_PRODUCTS_SUCCESSFULLY,
    result: {
      code_bills: result
    }
  })
})
