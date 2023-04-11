import { AuthValidation } from '@validation/auth.validation'
import { AuthController } from '@controller/auth.controller'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/signup', AuthValidation.signup, AuthController.signup)
authRouter.get('/activate/:email/:hex', AuthValidation.activate, AuthController.activate)
authRouter.post('/signin', AuthValidation.signin, AuthController.signin)

export default authRouter
