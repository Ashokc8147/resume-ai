import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import User from '../models/User'
import { ApiError } from '../utils/ApiError'
import { asyncHandler } from '../utils/asyncHandler'

interface JwtPayload {
  id: string
}

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized, no token')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload
      const user = await User.findById(decoded.id)

      if (!user || !user.isActive) {
        throw new ApiError(401, 'Not authorized, user not found')
      }

      req.user = user
      next()
    } catch {
      throw new ApiError(401, 'Not authorized, token invalid')
    }
  },
)
