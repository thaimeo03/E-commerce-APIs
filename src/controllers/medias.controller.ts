import { NextFunction, Request, Response } from 'express'
import { MEDIAS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/medias.service'
import { wrapHandler } from '~/utils/wrapHandler'

export const uploadImagesController = wrapHandler(async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadImages(req)

  res.json({
    message: MEDIAS_MESSAGES.UPLOAD_IMAGES_SUCCESSFULLY,
    result
  })
})
