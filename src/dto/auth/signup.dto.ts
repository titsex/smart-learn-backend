import { Roles } from '@prisma/client'

export class SignupDto {
    public email!: string
    public password!: string
    public role!: Exclude<Roles, 'developer'>
}
