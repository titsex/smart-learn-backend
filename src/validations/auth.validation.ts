import { body, param } from 'express-validator'
import { Roles } from '@prisma/client'

export class AuthValidation {
    public static roles: string[] = Object.values(Roles).filter((role: string) => role !== 'developer')

    public static signup = [
        body('email', 'Должен быть почтой').isEmail(),
        body('password', 'Должен иметь длину не менее 8 символов').isLength({ min: 8 }),
        body('role', "Должен быть 'student' или 'teacher'").matches(new RegExp(`${AuthValidation.roles.join('|')}`)),
    ]

    public static signin = [
        body('email', 'Должен быть почтой').isEmail(),
        body('password', 'Должен иметь длину не менее 8 символов').isLength({ min: 8 }),
    ]

    public static activate = [
        param('email', 'Должен быть почтой').isEmail(),
        param('hex', 'Не должен быть пустым').notEmpty(),
    ]
}
