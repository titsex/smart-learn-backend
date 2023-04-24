import { QuestionService } from '@service/question.service'
import { TestService } from '@service/test.service'
import { CreateDto, UpdateDto } from '@dto/answer'
import { updateData } from '@utils'
import { prisma } from '@database'

export class AnswerService {
    public static async create(data: CreateDto, userId: number) {
        const question = await QuestionService.isExist(data.questionId)
        await TestService.isCreator(question!.testId, userId)

        return await prisma.answer.create({
            data: {
                ...data,
            },
        })
    }

    public static async delete(id: number, userId: number) {
        const answer = await AnswerService.isExist(id)

        const question = await QuestionService.get(answer!.questionId)
        await TestService.isCreator(question!.testId, userId)

        return await prisma.answer.delete({
            where: {
                questionId: id,
            },
        })
    }

    public static async get(id: number) {
        return await AnswerService.isExist(id)
    }

    public static async update(data: UpdateDto, userId: number) {
        const answer = await AnswerService.isExist(data.id)

        const question = await QuestionService.get(answer!.questionId)
        await TestService.isCreator(question!.testId, userId)

        const updated = updateData(answer!, data, ['id', 'questionId'])

        return await prisma.answer.update({
            where: {
                id: answer!.id,
            },
            data: updated,
        })
    }

    public static async isExist(id: number, need = true) {
        const candidate = await prisma.answer.findUnique({
            where: {
                id,
            },
        })

        if (!candidate && need) throw new Error('Ответ не найден')
        if (candidate && !need) throw new Error('Ответ уже существует')

        return candidate
    }
}
