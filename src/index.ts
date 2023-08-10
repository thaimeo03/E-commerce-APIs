import express from 'express'
import usersRouter from './routes/users.routes'
import errorHandler from './middlewares/error.middleware'
import databaseService from './services/database.service'
import mediasRouter from './routes/medias.routes'
import { initUploadFile } from './utils/upload'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import adminRouter from './routes/admins.routes'
import categoriesRouter from './routes/categories.routes'
import productRouter from './routes/products.routes'
import cartsRouter from './routes/cart.routes'
import ordersRouter from './routes/orders.routes'
import ratingsRouter from './routes/ratings.routes'
import analyticsRouter from './routes/analytics.routes'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const HOSTNAME = 'localhost'
const PORT = process.env.PORT || 10000
initUploadFile()
databaseService.connect()

app.use(express.json())
app.use(cors())
// routes here
app.use('/admin', adminRouter)
app.use('/categories', categoriesRouter)
app.use('/users', usersRouter)
app.use('/products', productRouter)
app.use('/medias', mediasRouter)
app.use('/carts', cartsRouter)
app.use('/orders', ordersRouter)
app.use('/ratings', ratingsRouter)
app.use('/analytics', analyticsRouter)
app.use('/static/image', express.static(UPLOAD_IMAGE_DIR))
//

// Error handling
app.use(errorHandler)

app.listen(PORT, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
