import { checkAuth } from '@middleware/checkAuth.middleware'
import { checkRole } from '@middleware/checkRole.middleware'
import { Roles } from '@prisma/client'
import { Router } from 'express'

import questionRoute from '@route/question.route'
import accountRouter from '@route/account.route'
import answerRoute from '@route/answer.route'
import authRouter from '@route/auth.route'
import testRoute from '@route/test.route'

const router = Router()

router.use('/question', checkAuth, checkRole([Roles.teacher, Roles.developer]), questionRoute)
router.use('/answer', checkAuth, checkRole([Roles.teacher, Roles.developer]), answerRoute)
router.use('/test', checkAuth, checkRole([Roles.teacher, Roles.developer]), testRoute)
router.use('/account', accountRouter)
router.use('/auth', authRouter)

export default router
