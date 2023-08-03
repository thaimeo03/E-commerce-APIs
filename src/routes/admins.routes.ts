import { Router } from 'express'
import { banUserController, registerAdminController } from '~/controllers/admins.controller'
import { isAdminValidator, registerAdminValidator } from '~/middlewares/admins.middleware'
import { accessTokenValidator, userIdValidator } from '~/middlewares/users.middleware'

const adminRouter = Router()

// Register admin
// Body: username, email, password, confirm_password, admin_secret_key
adminRouter.post('/register', registerAdminValidator, registerAdminController)

// Ban user
// Header: access_token
// Params: user_id
adminRouter.patch('/ban/:user_id', accessTokenValidator, isAdminValidator, userIdValidator, banUserController)

export default adminRouter
