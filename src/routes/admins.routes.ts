import { Router } from 'express'
import { registerAdminController } from '~/controllers/admins.controller'
import { isAdminValidator, registerAdminValidator } from '~/middlewares/admins.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const adminRouter = Router()

// Register admin
// Body: username, email, password, confirm_password, admin_secret_key
adminRouter.post('/register', registerAdminValidator, registerAdminController)

export default adminRouter
