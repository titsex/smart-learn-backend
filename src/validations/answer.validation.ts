import { body, param } from 'express-validator'

export class AnswerValidation {
    public static create = [
        body('questionId', 'Должен быть числом').isInt().toInt(),
        body('title', 'Должен иметь длину от 2 до 512 символов').isLength({ min: 2, max: 512 }),
        body('description', 'Должен иметь длину от 2 до 1024 символов').isLength({ min: 2, max: 1024 }).optional(),
    ]

    public static delete = param('id', 'Должен быть числом').isInt().toInt()

    public static get = param('id', 'Должен быть числом').isInt().toInt()

    public static update = [
        body('id', 'Должен быть числом').isInt().toInt(),
        body('title', 'Должен иметь длину от 2 до 512 символов').isLength({ min: 2, max: 512 }).optional(),
        body('description', 'Должен иметь длину от 2 до 1024 символов').isLength({ min: 2, max: 1024 }).optional(),
    ]
}
