import { Router } from 'express'
import {
  addProductController,
  deleteProductController,
  removeProductFromCategoryController,
  updateProductController
} from '~/controllers/products.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { nameRemoveProductFromCategoryValidator } from '~/middlewares/categories.middleware'
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

// Remove product from a category
// Header: access_token
// Params: product_id
// Body: name
productRouter.post(
  '/:product_id/remove',
  accessTokenValidator,
  isAdminValidator,
  idProductValidator,
  nameRemoveProductFromCategoryValidator,
  removeProductFromCategoryController
)

// Update product
// Header: access_token
// Params: product_id
// Body: ProductBody
productRouter.put(
  '/update/:product_id',
  accessTokenValidator,
  isAdminValidator,
  idProductValidator,
  addProductValidator,
  updateProductController
)

export default productRouter
