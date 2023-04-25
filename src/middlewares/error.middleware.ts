import { NextFunction, Request, Response } from 'express'
import { HttpError } from '@class/Error'
import { getErrorMessage } from '@utils'

export default function errorMiddleware(
    error: Error | HttpError,
    request: Request,
    response: Response,
    _: NextFunction
) {
    if (error instanceof HttpError) {
        const { statusCode, ...data } = error

        let result = data

        if (data.errors) {
            const isArrayAndNotEmpty = Array.isArray(data.errors) && !data.errors.length
            const isObjectAndNotEmpty = !Array.isArray(data.errors) && !Object.keys(data.errors!).length

            if (isArrayAndNotEmpty || isObjectAndNotEmpty) result = (({ errors: _, ...rest }) => rest)(data)
        }

        return response.status(statusCode).json(result)
    }

    return response.status(404).send({
        error: `Произошла какая-то ошибка при запросе к ${request?.route?.stack?.at(-1).name || 'АПИ'}`,
        message: getErrorMessage(error),
    })
}
