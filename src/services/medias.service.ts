import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { uploadImages } from '~/utils/upload'
import fs from 'fs'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { isProduction } from '~/utils/config'

class MediaService {
  async uploadImages(req: Request) {
    const imagesData = await uploadImages(req)

    const result = await Promise.all(
      imagesData.map(async (imageData) => {
        const pathImage = path.join(UPLOAD_IMAGE_DIR, imageData.newFilename)
        await sharp(imageData.filepath).jpeg().toFile(pathImage)
        fs.unlinkSync(imageData.filepath)

        return isProduction
          ? `${process.env.HOST}/static/image/${imageData.newFilename}`
          : `http://localhost:${process.env.PORT}/static/image/${imageData.newFilename}`
      })
    )

    return result
  }
}

const mediaService = new MediaService()
export default mediaService
