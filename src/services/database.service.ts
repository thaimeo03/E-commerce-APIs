import { MongoClient, Db, Collection } from 'mongodb'
import 'dotenv/config'
import User from '~/models/database/User'
import RefreshToken from '~/models/database/RefreshToken'
import Category from '~/models/database/Category'
import Product from '~/models/database/Product'
import Cart from '~/models/database/Cart'
import Order from '~/models/database/Order'
import Rating from '~/models/database/Rating'

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@e-commerce.relh9wj.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  // Get collections
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }

  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORIES_COLLECTION as string)
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }

  get carts(): Collection<Cart> {
    return this.db.collection(process.env.DB_CARTS_COLLECTION as string)
  }

  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }

  get ratings(): Collection<Rating> {
    return this.db.collection(process.env.DB_RATINGS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
