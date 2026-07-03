import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess } from '../utils/response'
import { asyncHandler } from '../utils/asyncHandler'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const result = await authService.register(name, email, password)
  sendSuccess(res, result, 'Registration successful', 201)
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  sendSuccess(res, result, 'Login successful')
})

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const profile = await authService.getProfile(req.user!._id.toString())
  sendSuccess(res, profile)
})
