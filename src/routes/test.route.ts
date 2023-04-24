import { TestController } from '@controller/test.controller'
import { TestValidation } from '@validation/test.validation'
import { Router } from 'express'

const testRoute = Router()

testRoute.post('/create', TestValidation.create, TestController.create)

export default testRoute
