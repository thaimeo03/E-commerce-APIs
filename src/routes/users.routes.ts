import { Router } from 'express'
import {
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  updateUserController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  isUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  updateUserValidator
} from '~/middlewares/users.middleware'

const usersRouter = Router()

// Register
// Body: username, email, password, confirm_password
usersRouter.post('/register', registerValidator, registerController)

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

// Update user
// Body: UpdateUserBody
usersRouter.put('/update', accessTokenValidator, isUserValidator, updateUserValidator, updateUserController)

// Get profile
usersRouter.get('/profile', accessTokenValidator, isUserValidator, getProfileController)

export default usersRouter
