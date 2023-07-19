import { faker } from '@faker-js/faker'
import Product from '~/models/database/Product'
import databaseService from '~/services/database.service'

const PRODUCT_COUNT = 100

const createRandomProduct = () => {
  const product = {
    name: faker.commerce.productName(),
    main_image: faker.image.url(),
    images: [faker.image.url(), faker.image.url()],
    description: faker.lorem.paragraph({ min: 20, max: 160 }),
    price: {
      promotion: 0,
      regular: faker.commerce.price({ min: 20, max: 200 })
    },
    colors: [faker.color.human(), faker.color.human()],
    quantity: faker.number.int({ min: 50, max: 2000 }),
    status: faker.number.int({ min: 0, max: 1 }),
    categories: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product()]
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
      await databaseService.products.insertOne(new Product(product))
    })
  )
  console.log(`Created ${result.length} products`)
}

insertManyProducts(products).catch((err) => {
  console.log(err)
})