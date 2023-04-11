import { BadRequestErrorType } from '@types'

export class HttpError {
    constructor(
        public readonly statusCode: number,
        public readonly error: string = 'Никаких сведений об ошибке',
        public readonly message: string,
        public readonly errors?: BadRequestErrorType
    ) {}
}

export class BadRequest extends HttpError {
    constructor(message: string, error?: string) {
        super(400, error, message)
    }
}

export class Unvalidated extends HttpError {
    constructor(errors: BadRequestErrorType) {
        super(400, 'Неподтвержденный', 'Ошибка при проверке данных', errors)
    }
}

export class Unauthorized extends HttpError {
    constructor() {
        super(401, 'Неавторизованный', 'Вы должны войти в систему')
    }
}

export class Forbidden extends HttpError {
    constructor() {
        super(403, 'Запрещенный', "У тебя недостаточно прав")
    }
}
