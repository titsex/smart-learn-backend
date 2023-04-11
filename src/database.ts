import { PrismaClient } from '@prisma/client'
import { Logger } from '@class/Logger'

export let prisma: PrismaClient

export class Database {
    constructor() {
        prisma = new PrismaClient()

        prisma
            .$connect()
            .then(() => Logger.info('Успешное подключение к базе данных'))
            .catch(() => Logger.error('Произошла какая-то ошибка при подключении к базе данных'))
    }
}
