import { AnswerValidation } from '@validation/answer.validation'
import { AnswerController } from '@controller/answer.controller'
import { Router } from 'express'

const answerRoute = Router()

answerRoute.delete('/delete/:id', AnswerValidation.delete, AnswerController.delete)
answerRoute.post('/create', AnswerValidation.create, AnswerController.create)
answerRoute.put('/update', AnswerValidation.update, AnswerController.update)
answerRoute.get('/:id', AnswerValidation.get, AnswerController.get)

export default answerRoute
