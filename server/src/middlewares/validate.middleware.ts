import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ApiError } from '../utils/ApiError'

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || 'body'
        errors[key] = issue.message
      })
      next(new ApiError(400, Object.values(errors)[0] || 'Validation failed'))
      return
    }

    req.body = result.data
    next()
  }
