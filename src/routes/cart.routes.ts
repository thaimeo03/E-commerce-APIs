import { Router } from 'express'
import { addToCardController } from '~/controllers/carts.controller'
import { addToCardValidator } from '~/middlewares/carts.middleware'
import { accessTokenValidator, isUserValidator } from '~/middlewares/users.middleware'

const cartsRouter = Router()

// Add to cart
// Header: access_token
// Body: ItemCartBody
cartsRouter.post('/add', accessTokenValidator, isUserValidator, addToCardValidator, addToCardController)

export default cartsRouter
