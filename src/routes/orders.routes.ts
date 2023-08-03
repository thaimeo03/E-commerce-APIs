import { Router } from 'express'
import {
  cancelOrderController,
  changeOrderStatusController,
  getOrderInfoController,
  getOrderListController,
  orderManyProductsController,
  orderOneProductController
} from '~/controllers/orders.controller'
import {
  cancelOrderValidator,
  changeOrderStatusValidator,
  getOrderListValidator,
  orderIdValidator,
  orderManyProductsValidator,
  orderOneProductValidator
} from '~/middlewares/orders.middleware'
import { paginationValidator } from '~/middlewares/products.middleware'
import {
  accessTokenValidator,
  isDeliverValidator,
  isUserValidator,
  publicUserValidator
} from '~/middlewares/users.middleware'

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
  orderIdValidator,
  changeOrderStatusValidator,
  changeOrderStatusController
)

// Get order information
// Header: access_token
// Params: order_id
ordersRouter.get('/:order_id', publicUserValidator, orderIdValidator, getOrderInfoController)

// Cancel order (role user)
// Header: access_token
// Params: order_id
ordersRouter.patch(
  '/cancel/:order_id',
  accessTokenValidator,
  isUserValidator,
  orderIdValidator,
  cancelOrderValidator,
  cancelOrderController
)

// Get order list by user_id (Can be understand as transaction history)
// Header: access_token
// Query: status, page, limit
ordersRouter.get(
  '/',
  accessTokenValidator,
  isUserValidator,
  paginationValidator,
  getOrderListValidator,
  getOrderListController
)

export default ordersRouter
