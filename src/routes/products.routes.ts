import { Router } from 'express'
import { addProductController } from '~/controllers/products.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { addProductValidator } from '~/middlewares/products.validator'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const productRouter = Router()

// Add product
// Header: access_token
// Body: ProductBody
productRouter.post('/add', accessTokenValidator, isAdminValidator, addProductValidator, addProductController)

export default productRouter
