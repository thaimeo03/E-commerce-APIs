import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import crypto from 'crypto'
import { UPLOAD_DIR_TEMP, UPLOAD_IMAGE_DIR } from '~/constants/dir'

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
