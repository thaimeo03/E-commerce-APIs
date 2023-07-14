import { Router } from 'express'
import { loginController, logoutController, registerAdminController } from '~/controllers/users.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerAdminValidator
} from '~/middlewares/users.middleware'

const usersRouter = Router()

// Register admin
// Body: username, email, password, confirm_password, admin_secret_key
usersRouter.post('/register-admin', registerAdminValidator, registerAdminController)

// Login
// Body: email, password
usersRouter.post('/login', loginValidator, loginController)

// Logout
// Header: access_token
// Body: refresh_token
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, logoutController)

export default usersRouter
