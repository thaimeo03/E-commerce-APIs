import { Router } from 'express'
import { categoryController } from '~/controllers/categories.controller'
import { isAdminValidator } from '~/middlewares/admins.middleware'
import { categoryValidator } from '~/middlewares/categories.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const categoriesRouter = Router()

// Create product category
// Header: access_token
// Body: name
categoriesRouter.post('/', accessTokenValidator, isAdminValidator, categoryValidator, categoryController)

export default categoriesRouter
