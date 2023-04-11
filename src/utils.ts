import { validationMiddleware } from '@middleware/validation.middleware'
import { CustomRoute, expressFn, IValidationErrors } from '@types'
import { ValidationError, Result } from 'express-validator'
import { Request, Router } from 'express'
import { randomBytes } from 'crypto'

export const getDate = () => {
    const date = new Date()

    return [date, date.toLocaleString('ru-RU')]
}

export const randomString = (length: number) => randomBytes(length).toString('hex')

export const randomNumber = (minimum: number, maximum: number) =>
    Math.floor(Math.random() * (maximum - minimum + 1) + minimum)

export const generateUniqueHex = () => randomString(randomNumber(10, 20))

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

export const getErrorMessage = (error: unknown) => (error instanceof Error ? capitalize(error.message) : undefined)

export const getIp = (request: Request) =>
    request.headers['x-forwarded-for']?.toString() || request.socket.remoteAddress!.toString()

export const validationHandling = (errors: Result<ValidationError>) => {
    const result: IValidationErrors[] = []

    for (const error of errors.array()) {
        if (!result.find((x) => x.param === error.param)) result.push({ param: error.param, message: error.msg })
    }

    return result.length === 1 ? result[0] : result
}

export const asyncHandler = (fn: expressFn): expressFn => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

const changeRouteHandle = (route: CustomRoute) => {
    return route.stack.map((stack) => {
        if (stack.handle.constructor.name === 'AsyncFunction') {
            stack.handle = asyncHandler(stack.handle)
        }

        return stack
    })
}

const addValidationMiddlewareToStack = (stack: CustomRoute) => {
    const stacks = [...stack.stack]

    if (stacks.length <= 1) return stacks
    if (!stacks.find((x) => x.name === 'middleware')) return stacks

    const controller = stacks.pop()
    const middleware = Object.assign(Object.create(Object.getPrototypeOf(controller)), controller)

    middleware.handle = validationMiddleware
    middleware.name = 'validationMiddleware'

    stacks.push(middleware)
    stacks.push(controller!)

    return stacks
}

export const asyncHandlerStack = (router: Router) => {
    router.stack = router.stack.map((stack) => {
        if (stack.name === 'bound dispatch') {
            stack.stack = changeRouteHandle(stack.route)
        } else if (stack.name === 'router') {
            asyncHandlerStack(stack.handle)
        }

        if (stack.name === 'bound dispatch' && Array.isArray(stack.stack)) {
            stack.stack = addValidationMiddlewareToStack(stack)
            stack.route.stack = addValidationMiddlewareToStack(stack.route)
        }

        return stack
    })

    return router
}
