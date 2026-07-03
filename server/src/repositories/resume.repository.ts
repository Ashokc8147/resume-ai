import Resume, { IResume, ResumeStatus } from '../models/Resume'

export const resumeRepository = {
  create: (data: {
    userId: string
    title: string
    originalText: string
    fileMeta?: IResume['fileMeta']
  }): Promise<IResume> => Resume.create(data),

  findByUser: (userId: string): Promise<IResume[]> =>
    Resume.find({ userId }).sort({ createdAt: -1 }),

  findByIdAndUser: (id: string, userId: string): Promise<IResume | null> =>
    Resume.findOne({ _id: id, userId }),

  updateStatus: (id: string, status: ResumeStatus): Promise<IResume | null> =>
    Resume.findByIdAndUpdate(id, { status }, { new: true }),

  updateAnalysis: (
    id: string,
    data: { atsScore: number; feedback: IResume['feedback']; status: ResumeStatus },
  ): Promise<IResume | null> => Resume.findByIdAndUpdate(id, data, { new: true }),

  updateImprovement: (
    id: string,
    data: { improvedText: string; status: ResumeStatus },
  ): Promise<IResume | null> => Resume.findByIdAndUpdate(id, data, { new: true }),

  deleteByIdAndUser: (id: string, userId: string): Promise<IResume | null> =>
    Resume.findOneAndDelete({ _id: id, userId }),
}
