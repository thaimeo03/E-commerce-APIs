import { Router } from 'express'
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController
} from '~/controllers/categories.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { idCategoryValidator, nameCategoryValidator } from '~/middlewares/categories.middleware'
import { accessTokenValidator, isUserValidator } from '~/middlewares/users.middleware'

const categoriesRouter = Router()

// Create category
// Header: access_token
// Body: name
categoriesRouter.post('/', accessTokenValidator, isAdminValidator, nameCategoryValidator, createCategoryController)

// Delete category
// Header: access_token
// Params: category_id
categoriesRouter.delete(
  '/:category_id',
  accessTokenValidator,
  isAdminValidator,
  idCategoryValidator,
  deleteCategoryController
)

// Update category
// Header: access_token
// Params: category_id
// Body: name (new_name)
categoriesRouter.put(
  '/:category_id',
  accessTokenValidator,
  isAdminValidator,
  idCategoryValidator,
  nameCategoryValidator,
  updateCategoryController
)

// Get all categories
// Header: access_token
categoriesRouter.get('/', accessTokenValidator, isUserValidator, getCategoriesController)

export default categoriesRouter
