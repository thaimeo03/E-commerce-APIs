import { Router } from 'express'
import {
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  updateUserController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  forgotPasswordValidator,
  isUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
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

// Forgot password
// Body: email
usersRouter.post('/forgot-password', forgotPasswordValidator, forgotPasswordController)

// Reset password
// Body: forgot_password_token, old_password, new_password, confirm_new_password
usersRouter.post('/reset-password', resetPasswordValidator, resetPasswordController)

export default usersRouter
