import { faker } from '@faker-js/faker'
import Category from '~/models/database/Category'
import Product from '~/models/database/Product'
import databaseService from '~/services/database.service'

const PRODUCT_COUNT = 900

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
      await databaseService.products.insertOne(new Product(product))
    })
  )
  console.log(`Created ${result.length} products`)
}

insertManyProducts(products).catch((err) => {
  console.log(err)
})
