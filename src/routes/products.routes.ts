import { Router } from 'express'
import { addProductController, deleteProductController } from '~/controllers/products.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { addProductValidator, idProductValidator } from '~/middlewares/products.validator'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const productRouter = Router()

// Add product
// Header: access_token
// Body: ProductBody
productRouter.post('/add', accessTokenValidator, isAdminValidator, addProductValidator, addProductController)

// Delete product
// Header: access_token
// Params: product_id
productRouter.delete(
  '/:product_id',
  accessTokenValidator,
  isAdminValidator,
  idProductValidator,
  deleteProductController
)

export default productRouter
