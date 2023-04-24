import { TestService } from '@service/test.service'
import { CreateDto, UpdateDto } from '@dto/test'
import { Response } from 'express'
import { IRequest } from '@types'

export class TestController {
    public static async create(request: IRequest, response: Response) {
        const { title, description } = request.body as CreateDto

        const createdTest = await TestService.create({ title, description, creatorId: request.user!.id })

        return response.status(200).send(createdTest)
    }

    public static async delete(request: IRequest, response: Response) {
        const { id } = request.params

        const deletedTest = await TestService.delete(+id, request.user!.id)

        return response.status(200).json(deletedTest)
    }

    public static async update(request: IRequest, response: Response) {
        const { title, description, id } = request.body as UpdateDto

        const updatedTest = await TestService.update({ id, title, description }, request.user!.id)

        return response.status(200).send(updatedTest)
    }

    public static async get(request: IRequest, response: Response) {
        const { id } = request.params

        const test = await TestService.get(+id)

        return response.status(200).send(test)
    }
}
