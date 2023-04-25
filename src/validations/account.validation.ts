import { body, param } from 'express-validator'

export class AccountValidation {
    public static update = body('password', 'Должен иметь длину не менее 8 символов').isLength({ min: 8 })

    public static confirmUpdate = param('hex', 'Не должен быть пустым').notEmpty()
}
