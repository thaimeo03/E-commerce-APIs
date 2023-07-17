import Joi from 'joi'
import { CategoryBody } from '../interfaces/categories.interface'
import { CATEGORY_MESSAGES } from '~/constants/messages'

export const productCategorySchema = Joi.object<CategoryBody>({
  name: Joi.string().required().min(1).max(50).messages({
    'string.empty': CATEGORY_MESSAGES.NAME_CATEGORY_IS_REQUIRED,
    'string.min': CATEGORY_MESSAGES.NAME_CATEGORY_MIN_LENGTH,
    'string.max': CATEGORY_MESSAGES.NAME_CATEGORY_MAX_LENGTH
  })
})
