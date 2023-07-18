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
  CREATE_CATEGORY_SUCCESSFULLY: 'Create new category successfully',
  CATEGORY_ALREADY_EXIST: 'Category already exist',
  CATEGORY_NOT_FOUND: 'Category not found',
  DELETE_CATEGORY_SUCCESSFULLY: 'Delete category successfully',
  UPDATE_CATEGORY_SUCCESSFULLY: 'Update category successfully',
  PRODUCT_NOT_IN_CATEGORY: 'Product not in category'
} as const

export const PRODUCT_MESSAGES = {
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 1 characters',
  NAME_MAX_LENGTH: 'Name must be at most 50 characters',
  PRICE_AND_QUANTITY_MUST_BE_POSITIVE: 'Price and quantity must be positive',
  CATEGORY_MUST_BE_SELECTED: 'Category must be selected',
  ADD_PRODUCT_SUCCESSFULLY: 'Add product successfully',
  MAIN_IMAGE_IS_REQUIRED: 'Main image is required',
  QUANTITY_IS_REQUIRED: 'Quantity is required',
  PRODUCT_NOT_FOUND: 'Product not found',
  DELETE_PRODUCT_SUCCESSFULLY: 'Delete product successfully',
  REMOVE_PRODUCT_FROM_CATEGORY_SUCCESSFULLY: 'Remove product from category successfully'
}

export const MEDIAS_MESSAGES = {
  UPLOAD_IMAGES_SUCCESSFULLY: 'Upload image successfully'
}
