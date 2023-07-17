import { ProductBody } from '~/models/interfaces/products.interface'
import databaseService from './database.service'
import Category from '~/models/database/Category'
import Product from '~/models/database/Product'

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
}

const productService = new ProductService()
export default productService
