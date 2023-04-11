import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { validationHandling } from '@utils'
import { Unvalidated } from '@class/Error'

export function validationMiddleware(request: Request, response: Response, next: NextFunction) {
    const errors = validationResult(request)

    if (!errors.isEmpty()) throw new Unvalidated(validationHandling(errors))

    next()
}
