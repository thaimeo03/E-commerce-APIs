import { NextFunction, Request, Response } from 'express'
import { RATING_MESSAGES } from '~/constants/messages'
import { RatingBody, RatingQueries } from '~/models/interfaces/ratings.interface'
import ratingService from '~/services/ratings.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const createRatingController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decodedAccessToken?.user_id as string
  const payload = req.body as RatingBody

  const result = await ratingService.createRating({ user_id, payload })

  return res.json({
    message: RATING_MESSAGES.CREATE_RATING_SUCCESSFULLY,
    result
  })
})

export const getRatingsByProductIdController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const { limit, page, order } = req.query as RatingQueries

  const result = await ratingService.getRatingsByProductId(product_id, { limit, page, order })

  return res.json({
    message: RATING_MESSAGES.GET_RATINGS_SUCCESSFULLY,
    result
  })
})
