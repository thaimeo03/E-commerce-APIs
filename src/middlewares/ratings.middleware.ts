import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import { RatingBody, RatingQueries } from '~/models/interfaces/ratings.interface'
import { createRatingSchema } from '~/models/schemas/ratings.schema'
import databaseService from '~/services/database.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const createRatingValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  await createRatingSchema.validateAsync(omit(req.body as RatingBody, ['product_id']), { abortEarly: false })

  const product_id = (req.body as RatingBody).product_id
  const user_id = req.decodedAccessToken?.user_id as string
  const order = await databaseService.orders.findOne({
    user_id: new ObjectId(user_id),
    'product_info.product_id': new ObjectId(product_id)
  })

  if (!order) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.ORDER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  if (order.order_status !== OrderStatus.Completed) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.ORDER_NOT_COMPLETED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})

export const getRatingsByProductIdValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order } = req.query as RatingQueries
  if (order) {
    if (order) {
      if (order !== 'asc' && order !== 'desc') {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.INVALID_ORDER,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }
  }
})
