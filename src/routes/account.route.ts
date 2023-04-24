import { AccountController } from '@controller/account.controller'
import { Router } from 'express'

const accountRouter = Router()

accountRouter.post('/signout', AccountController.signout)
accountRouter.get('/refresh', AccountController.refresh)

export default accountRouter
