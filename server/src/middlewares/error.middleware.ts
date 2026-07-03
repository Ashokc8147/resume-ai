import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { env } from '../config/env'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
    return
  }

  if (err.message === 'Only PDF files are allowed') {
    res.status(400).json({ success: false, message: err.message })
    return
  }

  if (err.message.includes('File too large')) {
    res.status(400).json({ success: false, message: 'File size must be under 5MB' })
    return
  }

  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : err.message,
  })
}

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' })
}
