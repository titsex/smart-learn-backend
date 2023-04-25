import { AccountController } from '@controller/account.controller'
import { AccountValidation } from '@validation/account.validation'
import { checkAuth } from '@middleware/checkAuth.middleware'
import { Router } from 'express'

const accountRouter = Router()

accountRouter.post('/signout', AccountController.signout)
accountRouter.put('/update', checkAuth, AccountValidation.update, AccountController.update)
accountRouter.post('/update/confirm/:hex', checkAuth, AccountValidation.confirmUpdate, AccountController.confirmUpdate)
accountRouter.get('/refresh', AccountController.refresh)

export default accountRouter
