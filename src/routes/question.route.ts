import { QuestionValidation } from '@validation/question.validation'
import { QuestionController } from '@controller/question.controller'
import { Router } from 'express'

const questionRoute = Router()

questionRoute.delete('/delete/:id', QuestionValidation.delete, QuestionController.delete)
questionRoute.post('/create', QuestionValidation.create, QuestionController.create)
questionRoute.put('/update', QuestionValidation.update, QuestionController.update)
questionRoute.get('/getAll/:testId', QuestionValidation.getAll, QuestionController.getAll)
questionRoute.get('/:id', QuestionValidation.get, QuestionController.get)

export default questionRoute
