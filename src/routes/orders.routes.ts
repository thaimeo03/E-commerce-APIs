import { Router } from 'express'
import {
  changeOrderStatusController,
  orderManyProductsController,
  orderOneProductController
} from '~/controllers/orders.controller'
import {
  changeOrderStatusValidator,
  orderManyProductsValidator,
  orderOneProductValidator
} from '~/middlewares/orders.middleware'
import { accessTokenValidator, isDeliverValidator, isUserValidator } from '~/middlewares/users.middleware'

const ordersRouter = Router()

// Order one product
// Header: access_token
// Body: OrderBody
ordersRouter.post(
  '/product',
  accessTokenValidator,
  isUserValidator,
  orderOneProductValidator,
  orderOneProductController
)

// Order many products (in cart)
// Header: access_token
// Body: billing_address, receive_phone
ordersRouter.post(
  '/products',
  accessTokenValidator,
  isUserValidator,
  orderManyProductsValidator,
  orderManyProductsController
)

// Change order status (role deliver or admin)
// Header: access_token
// Params: order_id
// Body: order_status
ordersRouter.patch(
  '/status/:order_id',
  accessTokenValidator,
  isDeliverValidator,
  changeOrderStatusValidator,
  changeOrderStatusController
)

export default ordersRouter
