import Joi from 'joi'
import { ItemCartBody, UpdateCartBody } from '../interfaces/carts.interface'
import { CART_MESSAGES } from '~/constants/messages'

export const addToCartSchema = Joi.object<ItemCartBody>({
  product_id: Joi.string().required().messages({
    'string.empty': CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
  }),
  quantity: Joi.number().required().min(1).messages({
    'number.empty': CART_MESSAGES.QUANTITY_IS_REQUIRED,
    'number.min': CART_MESSAGES.QUANTITY_MIN
  }),
  color: Joi.string()
})

export const updateCartSchema = Joi.object<UpdateCartBody>({
  products_added: Joi.array<ItemCartBody[]>().items(addToCartSchema)
})
