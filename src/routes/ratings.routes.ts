import { Router } from 'express'
import { createRatingController, getRatingsByProductIdController } from '~/controllers/ratings.controller'
import { idProductValidator, paginationValidator } from '~/middlewares/products.middleware'
import { createRatingValidator, getRatingsByProductIdValidator } from '~/middlewares/ratings.middleware'
import { accessTokenValidator, isUserValidator, publicUserValidator } from '~/middlewares/users.middleware'

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

// Get ratings by product_id
// Header: access_token
// Params: product_id
// Query: page, limit, order: asc/desc (default asc)
ratingsRouter.get(
  '/:product_id',
  publicUserValidator,
  idProductValidator,
  paginationValidator,
  getRatingsByProductIdValidator,
  getRatingsByProductIdController
)

export default ratingsRouter
