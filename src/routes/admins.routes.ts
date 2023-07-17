import { Router } from 'express'
import { registerAdminController } from '~/controllers/admins.controller'
import { registerAdminValidator } from '~/middlewares/admins.middleware'

const adminRouter = Router()

// Register admin
// Body: username, email, password, confirm_password, admin_secret_key
adminRouter.post('/register-admin', registerAdminValidator, registerAdminController)

export default adminRouter
