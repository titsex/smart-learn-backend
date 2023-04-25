import { AccountService } from '@service/account.service'
import { Request, Response } from 'express'
import { UpdateDto } from '@dto/account'
import { IRequest } from '@types'
import { getIp } from '@utils'

export class AccountController {
    public static async refresh(request: Request, response: Response) {
        const { refreshToken } = request.cookies

        const userData = await AccountService.refresh({ refreshToken, ip: getIp(request) })

        response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        return response.status(200).json(userData)
    }

    public static async signout(request: Request, response: Response) {
        const { refreshToken } = request.cookies

        await AccountService.signout(refreshToken)
        response.clearCookie('refreshToken')

        return response.status(200).json({ message: 'Вы успешно вышли из системы' })
    }

    public static async update(request: IRequest, response: Response) {
        const { password } = request.body as UpdateDto

        const result = await AccountService.update({ password }, request.user!.id)

        return response.status(200).json(result)
    }

    public static async confirmUpdate(request: IRequest, response: Response) {
        const { hex } = request.params

        const updatedUserData = await AccountService.confirmUpdate(hex, request.user!.id)

        return response.status(200).json(updatedUserData)
    }
}
