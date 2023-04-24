import { CreateDto, UpdateDto } from '@dto/question'
import { TestService } from '@service/test.service'
import { updateData } from '@utils'
import { prisma } from '@database'

export class QuestionService {
    public static async create(data: CreateDto, userId: number) {
        await TestService.isCreator(data.testId, userId)

        return await prisma.question.create({ data })
    }

    public static async delete(id: number, userId: number) {
        const question = await QuestionService.isExist(id)

        await TestService.isCreator(question!.testId, userId)

        return await prisma.question.delete({
            where: {
                id,
            },
        })
    }

    public static async update(data: UpdateDto, userId: number) {
        const question = await QuestionService.isExist(data.id)

        await TestService.isCreator(question!.testId, userId)

        const updated = updateData(question!, data, ['id', 'testId'])

        return await prisma.question.update({
            where: {
                id: data.id,
            },
            data: updated,
        })
    }

    public static async get(id: number) {
        return await QuestionService.isExist(id)
    }

    public static async getAll(testId: number, userId: number) {
        await TestService.isCreator(testId, userId)

        return await prisma.question.findMany({
            where: {
                testId,
            },
        })
    }

    public static async isExist(id: number, need = true) {
        const candidate = await prisma.question.findUnique({
            where: {
                id,
            },
        })

        if (candidate && !need) throw new Error('Вопрос уже существует')
        if (!candidate && need) throw new Error('Вопрос не найден')

        return candidate
    }
}
