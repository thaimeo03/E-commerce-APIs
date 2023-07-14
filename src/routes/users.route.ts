import { Router } from 'express'
import { loginController, registerAdminController } from '~/controllers/users.controller'
import { loginValidator, registerAdminValidator } from '~/middlewares/users.middleware'

const usersRouter = Router()

// Register admin
// Body: username, email, password, confirm_password, admin_secret_key
usersRouter.post('/register-admin', registerAdminValidator, registerAdminController)

// Login
// Body: email, password
usersRouter.post('/login', loginValidator, loginController)

export default usersRouter
