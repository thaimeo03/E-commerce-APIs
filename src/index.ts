import express from 'express'
import usersRouter from './routes/users.routes'
import errorHandler from './middlewares/error.middleware'
import databaseService from './services/database.service'

const app = express()
const HOSTNAME = 'localhost'
const PORT = 4000
databaseService.connect()

app.use(express.json())
// routes here
app.use('/users', usersRouter)
//
app.use(errorHandler)

app.listen(PORT, HOSTNAME, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
