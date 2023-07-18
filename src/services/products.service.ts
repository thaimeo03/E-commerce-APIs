import { ProductBody } from '~/models/interfaces/products.interface'
import databaseService from './database.service'
import Category from '~/models/database/Category'
import Product from '~/models/database/Product'
import { deleteImageFileByUrl } from '~/utils/upload'

class ProductService {
  async addProduct(payload: ProductBody) {
    const { categories } = payload
    await Promise.all(
      categories.map(async (category) => {
        await databaseService.categories.findOneAndUpdate(
          { name: category },
          {
            $setOnInsert: new Category({ name: category })
          },
          {
            upsert: true
          }
        )
      })
    )

    await databaseService.products.insertOne(new Product(payload))
  }

  async deleteProduct(product: Product) {
    const imagesUrl = product.images
    imagesUrl.push(product.main_image)

    await Promise.all([deleteImageFileByUrl(imagesUrl), databaseService.products.deleteOne({ _id: product._id })])
  }

  async removeProductFromCategory({ product, name }: { product: Product; name: string }) {
    const { categories } = product
    if (categories.length === 1) {
      await this.deleteProduct(product)
    } else {
      await databaseService.products.updateOne(
        {
          _id: product._id
        },
        {
          $pull: {
            categories: name
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    }
  }
}

const productService = new ProductService()
export default productService
