import { TokenService } from '@service/token.service'
import { NextFunction, Response } from 'express'
import { Unauthorized } from '@class/Error'
import { IRequest } from '@types'

export function checkAuth(request: IRequest, response: Response, next: NextFunction) {
    const authorization = request.headers.authorization
    if (!authorization) throw new Unauthorized()

    const accessToken = authorization.split(' ')[1]
    if (!accessToken) throw new Unauthorized()

    const userData = TokenService.validateAccessToken(accessToken)
    if (!userData) throw new Unauthorized()

    request.user = userData
    next()
}
