import { ItemCartBody } from '~/models/interfaces/carts.interface'
import databaseService from './database.service'
import Cart from '~/models/database/Cart'
import { ObjectId, WithId } from 'mongodb'
import { ErrorWithStatus } from '~/models/error/ErrorCustom'
import { CART_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

class CartService {
  async addToCart({ user_id, payload }: { user_id: string; payload: ItemCartBody }) {
    const cart = await databaseService.carts.findOne({ user_id: new ObjectId(user_id) })

    // Check if cart exist
    if (!cart) {
      await databaseService.carts.insertOne(
        new Cart({
          user_id: new ObjectId(user_id),
          products_added: []
        })
      )
    }

    // Check if product already added
    const isExistedProductInCart = (cart as WithId<Cart>).products_added.some(
      (product) => product.product_id.toString() === payload.product_id
    )
    if (isExistedProductInCart) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.PRODUCT_ALREADY_ADDED,
        status: HTTP_STATUS.OK
      })
    }

    // Add product
    const result = await databaseService.carts.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id)
      },
      {
        $push: {
          products_added: {
            ...payload,
            product_id: new ObjectId(payload.product_id),
            color: payload.color || ''
          }
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return result.value as Cart
  }

  async removeProductFromCart({ product_id, user_id }: { product_id: string; user_id: string }) {
    const result = await databaseService.carts.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id)
      },
      {
        $pull: {
          products_added: {
            product_id: new ObjectId(product_id)
          }
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return result.value
  }
}

const cartService = new CartService()
export default cartService
