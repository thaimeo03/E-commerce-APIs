import { ProductBody, ProductQueries } from '~/models/interfaces/products.interface'
import databaseService from './database.service'
import Category from '~/models/database/Category'
import Product from '~/models/database/Product'
import { deleteImageFileByUrl } from '~/utils/upload'
import { ObjectId, WithId } from 'mongodb'
import { omit } from 'lodash'
import { deleteImagesOnS3 } from '~/utils/aws'

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

    await Promise.all([databaseService.products.deleteOne({ _id: product._id }), deleteImagesOnS3(imagesUrl)])
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

  async updateProduct({ payload, product_id }: { payload: ProductBody; product_id: string }) {
    const payloadNotCategories = omit(payload, ['categories'])
    const result = await databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(product_id)
      },
      {
        $set: payloadNotCategories,
        $currentDate: {
          updated_at: true
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return result.value as WithId<Product>
  }

  async getProducts(
    category_name: string | undefined,
    { name, order, sort_by, limit, page, price_min, price_max, rating }: ProductQueries
  ) {
    const categories_query = category_name ? { categories: category_name } : undefined
    const name_query = name ? { $text: { $search: encodeURIComponent(name) } } : undefined
    const order_query = order === 'asc' ? 1 : -1 // default -1
    const sort_key = sort_by === 'price' ? 'price.promotion' : sort_by || 'created_at'
    const sort_query = {
      [sort_key]: order_query
    }
    const page_query = Number(page) || 1
    const limit_query = Number(limit) || 20
    const price_min_query = price_min ? { $gte: Number(price_min) } : undefined
    const price_max_query = price_max ? { $lte: Number(price_max) } : undefined
    const price_range_query =
      price_min || price_max
        ? {
            'price.promotion': {
              ...price_min_query,
              ...price_max_query
            }
          }
        : undefined
    const rating_query = rating
      ? {
          average_rating: {
            $gte: Number(rating)
          }
        }
      : undefined

    const [products, total] = await Promise.all([
      databaseService.products
        .aggregate([
          {
            $match: {
              ...categories_query,
              ...name_query,
              ...price_range_query,
              ...rating_query
            }
          },
          {
            $project: {
              colors: 0,
              status: 0,
              // quantity: 0,
              categories: 0,
              updated_at: 0,
              images: 0,
              ratings: 0
            }
          },
          {
            $skip: (page_query - 1) * limit_query
          },
          {
            $limit: limit_query
          },
          {
            $sort: sort_query
          }
        ])
        .toArray(),
      databaseService.products.countDocuments({
        ...categories_query,
        ...name_query,
        ...price_range_query,
        ...rating_query
      })
    ])

    const total_page = Math.ceil(total / limit_query)

    return {
      products,
      pagination: {
        total_page,
        page: page_query,
        limit: limit_query
      }
    }
  }
}

const productService = new ProductService()
export default productService
