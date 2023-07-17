export const USER_MESSAGES = {
  USERNAME_IS_REQUIRED: 'Username is required',
  USERNAME_MIN_LENGTH: 'Username must be at least 1 characters',
  USERNAME_MAX_LENGTH: 'Username must be at most 50 characters',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  CONFIRM_PASSWORD_DO_NOT_MATCH: 'Confirm password does not match',
  ADMIN_SECRET_KEY_IS_REQUIRED: 'Admin secret key is required',
  REGISTER_ADMIN_SUCCESSFULLY: 'Register admin account successfully',
  EMAIL_ALREADY_EXIST: 'Email already exist',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password incorrect',
  BEARER_TOKEN_IS_REQUIRED: 'Bearer token is required',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  USER_NOT_FOUND: 'User not found',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully'
} as const

export const ADMIN_MESSAGES = {
  ROLE_MUST_BE_ADMIN: 'Role must be admin',
  ADMIN_SECRET_KEY_NOT_MATCH: 'Admin secret key does not match',
  ACCOUNT_IS_BANNED: 'Account is banned'
} as const

export const CATEGORY_MESSAGES = {
  NAME_CATEGORY_IS_REQUIRED: 'Name category is required',
  NAME_CATEGORY_MIN_LENGTH: 'Name category must be at least 1 characters',
  NAME_CATEGORY_MAX_LENGTH: 'Name category must be at most 50 characters',
  CREATE_CATEGORY_SUCCESSFULLY: 'Create new category successfully'
} as const

export const MEDIAS_MESSAGES = {
  UPLOAD_IMAGES_SUCCESSFULLY: 'Upload image successfully'
}
