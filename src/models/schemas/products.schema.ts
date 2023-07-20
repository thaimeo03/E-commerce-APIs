import Joi from 'joi'
import { ProductBody, ProductQueries } from '../interfaces/products.interface'
import { PRODUCT_MESSAGES } from '~/constants/messages'

export const addProductSchema = Joi.object<ProductBody>({
  name: Joi.string().required().min(1).max(50).messages({
    'string.empty': PRODUCT_MESSAGES.NAME_IS_REQUIRED,
    'string.min': PRODUCT_MESSAGES.NAME_MIN_LENGTH,
    'string.max': PRODUCT_MESSAGES.NAME_MAX_LENGTH
  }),
  main_image: Joi.string().required().messages({
    'string.empty': PRODUCT_MESSAGES.MAIN_IMAGE_IS_REQUIRED
  }),
  images: Joi.array().items(Joi.string()),
  description: Joi.string(),
  price: Joi.object({
    regular: Joi.number().required(),
    promotion: Joi.number().required()
  }),
  colors: Joi.array().items(Joi.string()),
  quantity: Joi.number().required().messages({
    'number.empty': PRODUCT_MESSAGES.QUANTITY_IS_REQUIRED
  }),
  categories: Joi.array().items(Joi.string())
})
