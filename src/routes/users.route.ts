import { Router } from 'express'
import { registerAdminController } from '~/controllers/users.controller'
import { registerAdminValidator } from '~/middlewares/users.middleware'

const usersRouter = Router()

// Register admin
// Body: username, email, password, confirm_password, admin_secret_key
usersRouter.post('/register-admin', registerAdminValidator, registerAdminController)

export default usersRouter
