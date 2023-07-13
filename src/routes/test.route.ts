import { Router } from 'express'
import { testController } from '~/controllers/test.controller'
import { testValidator } from '~/middlewares/validate.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const testRouter = Router()

testRouter.post('/', testValidator, wrapHandler(testController))

export default testRouter
