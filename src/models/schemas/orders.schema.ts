import Joi from 'joi'
import { OrderBody } from '../interfaces/orders.interface'
import { ORDER_MESSAGES } from '~/constants/messages'

export const orderOneProductSchema = Joi.object<Omit<OrderBody, 'product_info'>>({
  billing_address: Joi.object({
    street: Joi.string().required().messages({
      'string.empty': ORDER_MESSAGES.STREET_ADDRESS_IS_REQUIRED
    }),
    city: Joi.string().required().messages({
      'string.empty': ORDER_MESSAGES.CITY_ADDRESS_IS_REQUIRED
    })
  }),
  receive_phone: Joi.string().required().messages({
    'string.empty': ORDER_MESSAGES.RECEIVE_PHONE_IS_REQUIRED
  })
})
