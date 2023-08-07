import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import crypto from 'crypto'
import { UPLOAD_DIR_TEMP, UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { Upload } from '@aws-sdk/lib-storage'
import { S3Client, S3 } from '@aws-sdk/client-s3'
import path from 'path'
import 'dotenv/config'

export const initUploadFile = () => {
  ;[UPLOAD_DIR_TEMP, UPLOAD_IMAGE_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const uploadImages = async (req: Request) => {
  const formidable = (await import('formidable')).default

  const form = formidable({
    uploadDir: UPLOAD_DIR_TEMP,
    keepExtensions: true,
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalFileSize: 10 * 5 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const isImage = name === 'images' && Boolean(mimetype?.includes('image/'))
      if (!isImage) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return isImage
    },
    filename(name, ext, part, form) {
      const newName = crypto.randomBytes(8).toString('hex')
      return `${newName}.jpg`
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      if (!files.images) {
        return reject(new Error('File is empty'))
      }

      resolve(files.images as File[])
    })
  })
}

export const deleteImageFileByUrl = (urls: string[]) => {
  return Promise.resolve(
    urls.forEach((url) => {
      const urlSplit = url.split('/')
      const imageDir = path.join(UPLOAD_IMAGE_DIR, urlSplit[urlSplit.length - 1])
      fs.unlinkSync(imageDir)
    })
  )
}

export const uploadImageFileToS3 = ({
  nameFile,
  filepath,
  type
}: {
  nameFile: string
  filepath: string
  type: string
}) => {
  const uploadS3 = new Upload({
    client: new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
      }
    }),
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${nameFile}`,
      Body: fs.readFileSync(filepath),
      ContentType: type
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })

  return uploadS3.done()
}
