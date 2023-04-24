import { PrismaClient } from '@prisma/client'
import { Logger } from '@class/Logger'

export const prisma: PrismaClient = new PrismaClient()

export class Database {
    constructor() {
        prisma
            .$connect()
            .then(() => Logger.info('Успешное подключение к базе данных'))
            .catch(() => Logger.error('Произошла какая-то ошибка при подключении к базе данных'))
    }
}
