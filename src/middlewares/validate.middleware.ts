import Joi from 'joi'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { wrapHandler } from '~/utils/wrapHandler'

interface Input {
  email: string
  password: string
}

const userInput = {
  email: 'zZ5hB@examplecom',
  password: '123456'
}

const schema = Joi.object<Input>({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email is invalid'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  })
})

export const testValidator = wrapHandler(async () => {
  const value = await schema.validateAsync(userInput, { abortEarly: false })
})
