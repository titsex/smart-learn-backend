import { createClient, RedisClientType } from 'redis'
import { Logger } from '@class/Logger'

export class Cache {
    private static client: RedisClientType = createClient({
        url: process.env.REDIS_URL!,
    })

    public static async connect() {
        return await this.client
            .connect()
            .then(() => Logger.info('Успешное подключение к серверу кеширования данных - redis'))
            .catch(() => Logger.error('Произошла какая-то ошибка при подключении к серверу кеширования данных - redis'))
    }

    public static async getCache(key: string) {
        try {
            return await this.client.get(key)
        } catch (error) {
            throw new Error('Произошла какая-то ошибка при попытке получения данных по ключу')
        }
    }

    public static async setCache(key: string, value: string) {
        try {
            await this.client.set(key, value, { EX: 60 * 5 })
        } catch (error) {
            throw new Error('Произошла какая-то ошибка при поптыке установления данных')
        }
    }

    public static async deleteCache(key: string) {
        try {
            await this.client.del(key)
        } catch (error) {
            throw new Error('Произошла какая-то ошибка при попытке удаления данных по ключу')
        }
    }
}
