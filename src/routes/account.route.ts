import { AccountController } from '@controller/account.controller'
import { Router } from 'express'

const accountRouter = Router()

accountRouter.get('/refresh', AccountController.refresh)
accountRouter.post('/signout', AccountController.signout)

export default accountRouter
