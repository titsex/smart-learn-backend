import { NextFunction } from 'express'
import { User } from '@prisma/client'

export enum COLORS {
    NONE = '\x1b[0',
    CYAN = '\x1b[36',
    RED = '\x1b[31',
    YELLOW = '\x1b[33',
}

export enum COLOR_TYPES {
    NONE = 'm',
    BOLD = ';1m',
}

export type UserType = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export type expressFn = (req: Request, res: Response, next: NextFunction) => unknown

export interface Stack {
    handle: expressFn
    name?: string
}

export interface CustomRoute {
    stack: Stack[]
}

export interface IValidationErrors {
    param: string
    message: string
}

export type BadRequestErrorType = IValidationErrors | IValidationErrors[]
