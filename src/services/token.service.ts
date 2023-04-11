import { decode, JwtPayload, sign, verify } from 'jsonwebtoken'
import { GenerateUserInfo } from '@class/GenerateUserInfo'
import { prisma } from '@database'

export class TokenService {
    public static generateTokens(payload: GenerateUserInfo) {
        payload = { ...payload }

        const accessToken = sign(payload, process.env.JWT_ACCESS_KEY!, { expiresIn: '30m' })
        const refreshToken = sign(payload, process.env.JWT_REFRESH_KEY!, { expiresIn: '30d' })

        return { accessToken, refreshToken }
    }

    public static validateRefreshToken(token: string): GenerateUserInfo | null {
        try {
            return verify(token, process.env.JWT_REFRESH_KEY!) as GenerateUserInfo
        } catch (error) {
            return null
        }
    }

    public static validateAccessToken(token: string): GenerateUserInfo | null {
        try {
            return verify(token, process.env.JWT_ACCESS_KEY!) as GenerateUserInfo
        } catch (error) {
            return null
        }
    }

    public static async saveToken(userId: number, refreshToken: string, ip: string) {
        const tokens = await prisma.token.findMany({
            where: {
                user: {
                    id: userId,
                },
            },
        })

        if (tokens.length) {
            for (let i = 0; i < tokens.length; i++) {
                const info = decode(tokens[i].refreshToken) as JwtPayload

                if (Date.now() < info.exp!) {
                    await prisma.token.delete({
                        where: {
                            id: tokens[i].id,
                        },
                    })
                }

                if (tokens[i].ip === ip) {
                    tokens[i].refreshToken = refreshToken

                    return await prisma.token.update({
                        where: {
                            id: tokens[i].id,
                        },
                        data: tokens[i],
                    })
                }
            }
        }

        return await prisma.token.create({
            data: {
                userId,
                ip,
                refreshToken,
            },
        })
    }
}
