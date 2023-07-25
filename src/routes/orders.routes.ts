import { Router } from 'express'
import { orderManyProductsController, orderOneProductController } from '~/controllers/orders.controller'
import { orderManyProductsValidator, orderOneProductValidator } from '~/middlewares/orders.middleware'
import { accessTokenValidator, isUserValidator } from '~/middlewares/users.middleware'

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

export default ordersRouter
