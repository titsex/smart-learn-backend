import { CreateDto, UpdateDto } from '@dto/test'
import { prisma } from '@database'
import { updateData } from '@utils'

export class TestService {
    public static async create(data: CreateDto) {
        return await prisma.test.create({ data })
    }

    public static async delete(id: number, userId: number) {
        await TestService.isCreator(id, userId)

        return await prisma.test.delete({
            where: {
                id,
            },
        })
    }

    public static async update(data: UpdateDto, userId: number) {
        const test = await TestService.isCreator(data.id, userId)

        const updated = updateData(test!, data, ['id', 'creatorId', 'likes', 'description'])

        return await prisma.test.update({
            where: {
                id: data.id,
            },
            data: updated,
        })
    }

    public static async get(id: number) {
        return await TestService.isExist(id)
    }

    public static async isExist(id: number, need = true) {
        const candidate = await prisma.test.findUnique({
            where: {
                id,
            },
        })

        if (candidate && !need) throw new Error('Тест уже существует')
        if (!candidate && need) throw new Error('Тест не найден')

        return candidate
    }

    public static async isCreator(id: number, userId: number) {
        const test = await TestService.isExist(id)

        if (test!.creatorId !== userId) throw new Error('Это не ваш тест')

        return test
    }
}
