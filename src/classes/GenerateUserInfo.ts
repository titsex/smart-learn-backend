import { Roles } from '@prisma/client'
import { UserType } from '@types'

export class GenerateUserInfo {
    public email: string
    public roles: Roles[]

    constructor(user: UserType) {
        this.email = user.email
        this.roles = user.roles
    }
}
