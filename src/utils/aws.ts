import { SESClient } from '@aws-sdk/client-ses'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import 'dotenv/config'

export const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

export const getNameImage = (nameFile: string) => {
  const imageUrlArr = nameFile.split('/')
  return imageUrlArr[imageUrlArr.length - 1]
}

export const deleteImagesOnS3 = async (urls: string[]) => {
  await Promise.all(
    urls.map(async (url) => {
      const nameImage = getNameImage(url)

      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
        }
      })

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${nameImage}`
      })

      return s3.send(command)
    })
  )
}
