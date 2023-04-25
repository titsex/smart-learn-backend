import { GenerateUserInfo } from '@class/GenerateUserInfo'
import { TokenService } from '@service/token.service'
import { RefreshDto, UpdateDto } from '@dto/account'
import { generateUniqueHex, randomNumber, updateData } from '@utils'
import { Unauthorized } from '@class/Error'
import { prisma } from '@database'
import { hash } from 'bcrypt'
import { MailerService } from '@service/mailer.service'
import { Cache } from '@class/Cache'

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

    public static async update(data: UpdateDto, id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })

        if (data.password) data.password = await hash(data.password, randomNumber(5, 7))

        const updated = updateData(user!, data, ['id', 'updatedAt', 'email', 'roles', 'createdAt'])

        const confirmationLink = generateUniqueHex()
        await MailerService.sendMail(updated.email, confirmationLink, 'Обновление данных аккаунта')

        await Cache.setCache(`${updated.email}/${confirmationLink}`, JSON.stringify(updated))
        return { message: 'Мы отправили вам на почту ссылку для подтверждения смены данных на аккаунте' }
    }

    public static async confirmUpdate(hex: string, id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })

        const cachedData = await Cache.getCache(`${user!.email}/${hex}`)
        if (!cachedData) throw new Error('Скорее всего истекло время, либо неверный код подтверждения')

        await Cache.deleteCache(`${user!.email}/${hex}`)

        const { password: _, ...updatedUserData } = await prisma.user.update({
            where: {
                id,
            },
            data: JSON.parse(cachedData),
        })

        return updatedUserData
    }
}
