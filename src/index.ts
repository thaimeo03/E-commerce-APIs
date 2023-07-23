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

const app = express()
const HOSTNAME = 'localhost'
const PORT = 4000
initUploadFile()
databaseService.connect()

app.use(express.json())
// routes here
app.use('/admin', adminRouter)
app.use('/categories', categoriesRouter)
app.use('/users', usersRouter)
app.use('/products', productRouter)
app.use('/medias', mediasRouter)
app.use('/carts', cartsRouter)
app.use('/orders', ordersRouter)
app.use('/static/image', express.static(UPLOAD_IMAGE_DIR))
//

// Error handling
app.use(errorHandler)

app.listen(PORT, HOSTNAME, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
