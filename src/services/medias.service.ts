import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { uploadImageFileToS3, uploadImages } from '~/utils/upload'
import fsPromise from 'fs/promises'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import mime from 'mime'

class MediaService {
  async uploadImages(req: Request) {
    const imagesData = await uploadImages(req)

    const result = await Promise.all(
      imagesData.map(async (imageData) => {
        const pathImage = path.join(UPLOAD_IMAGE_DIR, imageData.newFilename)
        await sharp(imageData.filepath).jpeg().toFile(pathImage)

        const image = await uploadImageFileToS3({
          nameFile: imageData.newFilename,
          filepath: pathImage,
          type: mime.getType(pathImage) as string
        })

        // Delete file after upload
        await Promise.all([fsPromise.unlink(imageData.filepath), fsPromise.unlink(pathImage)])

        return (image as CompleteMultipartUploadCommandOutput).Location as string
      })
    )

    return result
  }
}

const mediaService = new MediaService()
export default mediaService
