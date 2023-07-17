import { Router } from 'express'
import { uploadImagesController } from '~/controllers/medias.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'

const mediasRouter = Router()

// Upload images
// Body: images file
mediasRouter.post('/upload-image', accessTokenValidator, uploadImagesController)

export default mediasRouter
