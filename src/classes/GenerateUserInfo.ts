import { Roles } from '@prisma/client'
import { UserType } from '@types'

export class GenerateUserInfo {
    public id: number
    public email: string
    public roles: Roles[]

    constructor(user: UserType) {
        this.id = user.id
        this.email = user.email
        this.roles = user.roles
    }
}
