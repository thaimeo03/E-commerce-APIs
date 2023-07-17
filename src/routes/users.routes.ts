import { Router } from 'express'
import { loginController, logoutController, refreshTokenController } from '~/controllers/users.controller'
import { accessTokenValidator, loginValidator, refreshTokenValidator } from '~/middlewares/users.middleware'

const usersRouter = Router()

// Login
// Body: email, password
usersRouter.post('/login', loginValidator, loginController)

// Logout
// Header: access_token
// Body: refresh_token
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, logoutController)

// Refresh token
// Body: refresh_token
usersRouter.post('/refresh-token', refreshTokenValidator, refreshTokenController)

export default usersRouter
