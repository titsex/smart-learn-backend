import { AnswerService } from '@service/answer.service'
import { CreateDto, UpdateDto } from '@dto/answer'
import { Response } from 'express'
import { IRequest } from '@types'

export class AnswerController {
    public static async create(request: IRequest, response: Response) {
        const { title, description, questionId } = request.body as CreateDto

        const createdAnswer = await AnswerService.create({ title, description, questionId }, request.user!.id)

        return response.status(200).send(createdAnswer)
    }

    public static async delete(request: IRequest, response: Response) {
        const { id } = request.params

        const deletedAnswer = await AnswerService.delete(+id, request.user!.id)

        return response.status(200).send(deletedAnswer)
    }

    public static async update(request: IRequest, response: Response) {
        const { title, description, id } = request.body as UpdateDto

        const updatedAnswer = await AnswerService.update({ title, description, id }, request.user!.id)

        return response.status(200).send(updatedAnswer)
    }

    public static async get(request: IRequest, response: Response) {
        const { id } = request.params

        const answer = await AnswerService.get(+id)

        return response.status(200).send(answer)
    }
}
