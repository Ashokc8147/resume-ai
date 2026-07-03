import User, { IUser } from '../models/User'

export const userRepository = {
  findByEmail: (email: string, includePassword = false): Promise<IUser | null> => {
    const query = User.findOne({ email })
    return includePassword ? query.select('+password') : query
  },

  findById: (id: string): Promise<IUser | null> => User.findById(id),

  create: (data: { name: string; email: string; password: string }): Promise<IUser> =>
    User.create(data),

  deductCredit: async (userId: string): Promise<IUser | null> => {
    return User.findOneAndUpdate(
      { _id: userId, credits: { $gte: 1 } },
      { $inc: { credits: -1 } },
      { new: true },
    )
  },

  refundCredit: async (userId: string): Promise<void> => {
    await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } })
  },
}
