import Joi from 'joi'
import { RatingBody } from '../interfaces/ratings.interface'
import { RATING_MESSAGES } from '~/constants/messages'

export const createRatingSchema = Joi.object<Omit<RatingBody, 'product_id'>>({
  rating: Joi.number().required().min(1).max(5).messages({
    'number.empty': RATING_MESSAGES.RATING_IS_REQUIRED,
    'number.min': RATING_MESSAGES.RATING_MIN,
    'number.max': RATING_MESSAGES.RATING_MAX
  }),
  comment: Joi.string()
})
