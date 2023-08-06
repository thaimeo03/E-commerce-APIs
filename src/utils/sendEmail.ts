import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import fs from 'fs'
import 'dotenv/config'
import path from 'path'

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const createSendEmailCommand = ({
  toAddress,
  fromAddress,
  body,
  subject
}: {
  toAddress: string
  fromAddress: string
  body: string
  subject: string
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress
        /* more To-email addresses */
      ]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ]
  })
}

const send = async ({ toAddress, body, subject }: { toAddress: string; body: string; subject: string }) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddress,
    body,
    subject
  })

  try {
    return await sesClient.send(sendEmailCommand)
  } catch (e) {
    console.error('Failed to send email.')
    return e
  }
}

// Templates
const resetPasswordTemplate = fs.readFileSync(path.resolve('src/templates/reset-password.html'), 'utf8')

export const sendEmailVerifyForgotPassword = async ({
  toAddress,
  forgot_password_token,
  username
}: {
  toAddress: string
  forgot_password_token: string
  username: string
}) => {
  const subject = 'Reset Password'
  const body = resetPasswordTemplate
    .replace(/{{action_url}}/g, `${process.env.URL_CLIENT}/reset-password?token=${forgot_password_token}`)
    .replace('{{name}}', username)

  return send({ toAddress, body, subject })
}
