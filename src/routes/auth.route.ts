import { AuthValidation } from '@validation/auth.validation'
import { AuthController } from '@controller/auth.controller'
import { Router } from 'express'

const authRouter = Router()

authRouter.get('/activate/:email/:hex', AuthValidation.activate, AuthController.activate)
authRouter.post('/signup', AuthValidation.signup, AuthController.signup)
authRouter.post('/signin', AuthValidation.signin, AuthController.signin)

export default authRouter
