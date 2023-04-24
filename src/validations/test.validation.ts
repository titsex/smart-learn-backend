import { body } from 'express-validator'

export class TestValidation {
    public static create = [
        body('title', 'Должен иметь длину от 2 до 128 символов').isLength({ min: 2, max: 128 }),
        body('description', 'Должен иметь длину от 2 до 256 символов').isLength({ min: 2, max: 256 }).optional(),
    ]
}
