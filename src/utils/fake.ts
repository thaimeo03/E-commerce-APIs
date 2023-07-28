import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import Category from '~/models/database/Category'
import Order from '~/models/database/Order'
import Product from '~/models/database/Product'
import Rating from '~/models/database/Rating'
import databaseService from '~/services/database.service'

const PRODUCT_COUNT = 2000
const account_ids = ['64b4d40cdae7493f45d32e57', '64c24f74b06e6a109f3877b1']

const createRandomProduct = () => {
  const product = {
    name: faker.commerce.productName(),
    main_image: faker.image.url(),
    images: [faker.image.url(), faker.image.url()],
    description: faker.lorem.paragraph({ min: 20, max: 160 }),
    price: {
      promotion: Number.parseFloat(faker.commerce.price({ min: 0, max: 50 })),
      regular: Number.parseFloat(faker.commerce.price({ min: 50, max: 200 }))
    },
    sold: faker.number.int({ min: 50, max: 2000 }),
    colors: [faker.color.human(), faker.color.human()],
    quantity: faker.number.int({ min: 50, max: 2000 }),
    status: faker.number.int({ min: 0, max: 1 }),
    categories: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product()],
    created_at: faker.date.past()
  }

  return product
}

const products = faker.helpers.multiple(createRandomProduct, {
  count: PRODUCT_COUNT
})

const insertManyProducts = async (products: any) => {
  console.log('Creating products...')
  const result = await Promise.all(
    products.map(async (product: any) => {
      product.categories.map(async (category: string) => {
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
      const res = await databaseService.products.insertOne(new Product(product))
      return res.insertedId
    })
  )
  console.log(`Created ${result.length} products`)
  return result
}

const randomProductInfo = (product_id: ObjectId, account_id: string) => {
  const product_info = {
    user_id: new ObjectId(account_id),
    billing_address: {
      street: 'Thon Bo La, Xa Vu Vinh, Huyen Vu Thu',
      city: 'Thai Binh'
    },
    receive_phone: '0355807129',
    product_info: {
      product_id: product_id,
      quantity: Math.floor(Math.random() * 20)
    },
    order_status: OrderStatus.Completed
  }

  return product_info
}

const randomRating = (product_id: ObjectId, account_id: string) => {
  const rating = {
    user_id: new ObjectId(account_id),
    product_id: product_id,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: 'No problem'
  }
  return rating
}

const insertManyOrderProductsAndRating = async (product_ids: ObjectId[]) => {
  console.log('Creating orders and ratings...')
  await Promise.all(
    account_ids.map(async (account_id) => {
      await Promise.all(
        product_ids.map(async (product_id) => {
          const order = await databaseService.orders.insertOne(new Order(randomProductInfo(product_id, account_id)))
          // await databaseService.ratings.insertOne(new Rating(randomRating(product_id, account_id)))
          return order.insertedId
        })
      )
    })
  )
  console.log(`Created orders and ratings`)
}

insertManyProducts(products)
  .then((data) => insertManyOrderProductsAndRating(data))
  .catch((err) => {
    console.log(err)
  })
