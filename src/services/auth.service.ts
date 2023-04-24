import { ActivateDto, SignupDto, SigninDto } from '@dto/auth'
import { GenerateUserInfo } from '@class/GenerateUserInfo'
import { generateUniqueHex, randomNumber } from '@utils'
import { MailerService } from '@service/mailer.service'
import { TokenService } from '@service/token.service'
import { compare, hash } from 'bcrypt'
import { Cache } from '@class/Cache'
import { prisma } from '@database'
import { UserType } from '@types'

export class AuthService {
    public static async signup(data: SignupDto) {
        const cachedData = await Cache.getCache(data.email)

        if (cachedData)
            throw new Error('Эта почта уже находится на последнем этапе регистрации и ожидает подтверждения')

        const candidate = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        })

        if (candidate) throw new Error('Пользователь с таким адресом электронной почты уже зарегистрирован')

        const password = await hash(data.password, randomNumber(5, 7))

        const user: Omit<UserType, 'id'> = {
            email: data.email,
            password,
            roles: [data.role],
        }

        const activationLink = generateUniqueHex()
        await MailerService.sendActivationMail(user.email, activationLink)

        await Cache.setCache(`${user.email}/${activationLink}`, JSON.stringify(user))
        return { message: 'Мы отправили вам на почту ссылку для активации аккаунта' }
    }

    public static async activate(data: ActivateDto) {
        const candidate = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        })

        if (candidate) throw new Error('Ваша учетная запись уже активирована')

        const cachedData = await Cache.getCache(`${data.email}/${data.hex}`)
        if (!cachedData) throw new Error('Скорее всего истекло время, либо неверна почта или код активации')

        await Cache.deleteCache(`${data.email}/${data.hex}`)

        const cachedUser: UserType = JSON.parse(cachedData)
        const user = await prisma.user.create({ data: cachedUser })

        const userInfo = new GenerateUserInfo(user)
        const tokens = TokenService.generateTokens(userInfo)

        await TokenService.saveToken(user.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userInfo }
    }

    public static async signin(data: SigninDto) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        })

        if (!user) throw new Error('Пользователь с такой электронной почтой не зарегистрирован')

        const isPassEquals = await compare(data.password, user.password)
        if (!isPassEquals) throw new Error('Неверный пароль')

        const userInfo = new GenerateUserInfo(user)
        const tokens = TokenService.generateTokens(userInfo)

        await TokenService.saveToken(user.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userInfo }
    }
}
