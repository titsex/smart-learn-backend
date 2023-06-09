import { config } from 'dotenv'
config()

import errorMiddleware from '@middleware/error.middleware'
import cookieParser from 'cookie-parser'
import express from 'express'
import router from '@router'

import { asyncHandlerStack } from '@utils'
import { Logger } from '@class/Logger'
import { Database } from '@database'
import { Cache } from '@class/Cache'

const app = express()
const port = 5000 || process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('/api', asyncHandlerStack(router))
app.use(errorMiddleware)

const start = async () => {
    try {
        await new Database()
        await Cache.connect()

        app.listen(port, () => Logger.info(`Сервер успешно запущен на ${port} порту`))
    } catch (error) {
        Logger.error(error)
    }
}

start().then()
