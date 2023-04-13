import { Forbidden, Unauthorized } from '@class/Error'
import { Response, NextFunction } from 'express'
import { Roles } from '@prisma/client'
import { IRequest } from '@types'

export function checkRole(roles: Roles[]) {
    return function (request: IRequest, response: Response, next: NextFunction) {
        if (!request.user) throw new Unauthorized()

        for (const role of roles) {
            if (request.user.roles.includes(role)) return next()
        }

        throw new Forbidden()
    }
}
