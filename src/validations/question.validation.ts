import { body, param } from 'express-validator'

export class QuestionValidation {
    public static create = [
        body('testId', 'Должен быть числом').isInt().toInt(),
        body('title', 'Должен иметь длину от 2 до 256 символов').isLength({ min: 2, max: 256 }),
        body('description', 'Должен иметь длину от 2 до 512 символов').isLength({ min: 2, max: 512 }).optional(),
    ]

    public static delete = param('id', 'Должен быть числом').isInt().toInt()

    public static get = param('id', 'Должен быть числом').isInt().toInt()

    public static getAll = param('testId', 'Должен быть числом').isInt().toInt()

    public static update = [
        body('id', 'Должен быть числом').isInt().toInt(),
        body('title', 'Должен иметь длину от 2 до 256 символов').isLength({ min: 2, max: 256 }).optional(),
        body('description', 'Должен иметь длину от 2 до 512 символов').isLength({ min: 2, max: 512 }).optional(),
    ]
}
