import express from 'express'
import testRouter from './routes/test.route'
import errorHandler from './middlewares/error.middleware'
import databaseService from './services/database.service'

const app = express()
const HOSTNAME = 'localhost'
const PORT = 4000
databaseService.connect()

app.use(express.json())
// routes here
app.use('/test', testRouter)
//
app.use(errorHandler)

app.listen(PORT, HOSTNAME, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
