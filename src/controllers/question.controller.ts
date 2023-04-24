import { QuestionService } from '@service/question.service'
import { CreateDto, UpdateDto } from '@dto/question'
import { Response } from 'express'
import { IRequest } from '@types'

export class QuestionController {
    public static async create(request: IRequest, response: Response) {
        const { title, description, testId } = request.body as CreateDto

        const createdQuestion = await QuestionService.create({ title, description, testId }, request.user!.id)

        return response.status(200).send(createdQuestion)
    }

    public static async delete(request: IRequest, response: Response) {
        const { id } = request.params

        const deletedQuestion = await QuestionService.delete(+id, request.user!.id)

        return response.status(200).send(deletedQuestion)
    }

    public static async update(request: IRequest, response: Response) {
        const { title, description, id } = request.body as UpdateDto

        const updatedQuestion = await QuestionService.update({ id, title, description }, request.user!.id)

        return response.status(200).send(updatedQuestion)
    }

    public static async get(request: IRequest, response: Response) {
        const { id } = request.params

        const question = await QuestionService.get(+id)

        return response.status(200).send(question)
    }

    public static async getAll(request: IRequest, response: Response) {
        const { testId } = request.params

        const questions = await QuestionService.getAll(+testId, request.user!.id)

        return response.status(200).send(questions)
    }
}
