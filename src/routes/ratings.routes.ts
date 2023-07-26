import { Router } from 'express'
import { createRatingController } from '~/controllers/ratings.controller'
import { idProductValidator } from '~/middlewares/products.middleware'
import { createRatingValidator } from '~/middlewares/ratings.middleware'
import { accessTokenValidator, isUserValidator } from '~/middlewares/users.middleware'

const ratingsRouter = Router()

// Create rating
// Header: access_token
// Body: RatingBody
ratingsRouter.post(
  '/',
  accessTokenValidator,
  isUserValidator,
  idProductValidator,
  createRatingValidator,
  createRatingController
)

export default ratingsRouter
