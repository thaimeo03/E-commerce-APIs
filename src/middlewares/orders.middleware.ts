import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { ItemCartBody } from '~/models/interfaces/carts.interface'
import { addToCartSchema } from '~/models/schemas/carts.schema'
import { orderOneProductSchema } from '~/models/schemas/orders.schema'
import { wrapHandler } from '~/utils/wrapHandler'
import { checkProductInfo } from './carts.middleware'
import databaseService from '~/services/database.service'
import { ObjectId } from 'mongodb'
import User from '~/models/database/User'
import { ErrorWithStatus } from '~/models/res/ErrorCustom'
import { ORDER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { OrderListQuery, OrderStatusBody } from '~/models/interfaces/orders.interface'
import { OrderStatus } from '~/constants/enums'
import Order from '~/models/database/Order'

const checkAddressAndPhone = async (req: Request) => {
  const { billing_address, receive_phone } = await orderOneProductSchema.validateAsync(omit(req.body, 'product_info'), {
    abortEarly: false
  })

  const user_id = req.decodedAccessToken?.user_id as string
  const user = (await databaseService.users.findOne({ _id: new ObjectId(user_id) })) as User
  // Check billing address must be in addresses user
  if (
    !user.addresses.some(
      (address) => address.street === billing_address.street && address.city === billing_address.city
    )
  ) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.BILLING_ADDRESS_MUST_BE_IN_ADDRESSES_USER,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
  // Check receive phone must be in phones user
  if (!user.phone.includes(receive_phone)) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.RECEIVE_PHONE_MUST_BE_IN_PHONES_USER,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const orderOneProductValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.product_info) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.PRODUCT_INFO_IS_REQUIRED,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY
    })
  }
  const product_info = await addToCartSchema.validateAsync(req.body.product_info as ItemCartBody, { abortEarly: false })
  await checkProductInfo(product_info)

  await checkAddressAndPhone(req)
})

export const orderManyProductsValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  await checkAddressAndPhone(req)
})

export const orderIdValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.params

  const order = await databaseService.orders.findOne({ _id: new ObjectId(order_id) })
  if (!order) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.ORDER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  req.order = order
})

export const changeOrderStatusValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order_status } = req.body as OrderStatusBody

  if (!order_status) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.ORDER_STATUS_IS_REQUIRED,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY
    })
  }

  if (!Object.values(OrderStatus).includes(order_status)) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.INVALID_ORDER,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  if (order_status === OrderStatus.Cancelled) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.DELIVER_CAN_NOT_BE_CANCELLED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})

export const cancelOrderValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = req.order as Order

  if (order.order_status !== OrderStatus.Pending) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.CAN_NOT_BE_CANCELLED_AFTER_PRODUCT_DELIVERED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
})

export const getOrderListValidator = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.query as OrderListQuery

  if (status) {
    const num = Number(status)
    if (!Object.values(OrderStatus).includes(num)) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.INVALID_ORDER,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }
})
