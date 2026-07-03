import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '../config/env'
import { userRepository } from '../repositories/user.repository'
import { ApiError } from '../utils/ApiError'
import { IUser } from '../models/User'

const SALT_ROUNDS = 12

export const authService = {
  generateToken: (userId: string): string =>
    jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: '7d' }),

  hashPassword: (password: string): Promise<string> =>
    bcrypt.hash(password, SALT_ROUNDS),

  comparePassword: (plain: string, hash: string): Promise<boolean> =>
    bcrypt.compare(plain, hash),

  sanitizeUser: (user: IUser) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    credits: user.credits,
    role: user.role,
  }),

  register: async (name: string, email: string, password: string) => {
    const existing = await userRepository.findByEmail(email)
    if (existing) throw new ApiError(400, 'User already exists with this email')

    const hashedPassword = await authService.hashPassword(password)
    const user = await userRepository.create({ name, email, password: hashedPassword })
    const token = authService.generateToken(user._id.toString())

    return { user: authService.sanitizeUser(user), token }
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email, true)
    if (!user?.password) throw new ApiError(401, 'Invalid email or password')

    const isMatch = await authService.comparePassword(password, user.password)
    if (!isMatch) throw new ApiError(401, 'Invalid email or password')

    const token = authService.generateToken(user._id.toString())
    return { user: authService.sanitizeUser(user), token }
  },

  getProfile: async (userId: string) => {
    const user = await userRepository.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')
    return authService.sanitizeUser(user)
  },
}
