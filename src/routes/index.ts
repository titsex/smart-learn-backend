import { Router } from 'express'

import accountRouter from '@route/account.route'
import authRouter from '@route/auth.route'

const router = Router()

router.use('/account', accountRouter)
router.use('/auth', authRouter)

export default router
