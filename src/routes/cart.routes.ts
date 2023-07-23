import { Router } from 'express'
import { addToCardController, removeProductFromCartController } from '~/controllers/carts.controller'
import { addToCardValidator } from '~/middlewares/carts.middleware'
import { idProductValidator } from '~/middlewares/products.middleware'
import { accessTokenValidator, isUserValidator } from '~/middlewares/users.middleware'

const cartsRouter = Router()

// Add to cart
// Header: access_token
// Body: ItemCartBody
cartsRouter.post('/add', accessTokenValidator, isUserValidator, addToCardValidator, addToCardController)

// Remove product from cart
// Header: access_token
// Params: product_id
cartsRouter.delete(
  '/:product_id',
  accessTokenValidator,
  isUserValidator,
  idProductValidator,
  removeProductFromCartController
)

export default cartsRouter
