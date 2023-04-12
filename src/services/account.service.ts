import { RefreshDto } from '@dto/account/refresh.dto'
import { TokenService } from '@service/token.service'
import { prisma } from '@database'
import { GenerateUserInfo } from '@class/GenerateUserInfo'
import { Unauthorized } from '@class/Error'

export class AccountService {
    public static async refresh(data: RefreshDto) {
        if (!data.refreshToken) throw new Unauthorized()

        const userData = TokenService.validateRefreshToken(data.refreshToken)

        const tokenFromDb = await prisma.token.findFirst({
            where: {
                refreshToken: data.refreshToken,
            },
        })

        if (!userData || !tokenFromDb) throw new Unauthorized()

        const user = await prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        })

        if (!user) throw new Error('Пользователя нет в базе данных')

        const userInfo = new GenerateUserInfo(user)
        const tokens = TokenService.generateTokens(userInfo)

        await TokenService.saveToken(user.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userInfo }
    }

    public static async signout(refreshToken: string) {
        const candidate = await prisma.token.findFirst({
            where: {
                refreshToken,
            },
        })

        if (!candidate) throw new Unauthorized()

        return await prisma.token.delete({
            where: {
                id: candidate.id,
            },
        })
    }
}
