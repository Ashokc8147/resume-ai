import { resumeRepository } from '../repositories/resume.repository'
import { userRepository } from '../repositories/user.repository'
import { pdfService } from './pdf.service'
import { geminiService } from './gemini.service'
import { ApiError } from '../utils/ApiError'

export const resumeService = {
  upload: async (
    userId: string,
    file: Express.Multer.File,
    title?: string,
  ) => {
    const originalText = await pdfService.extractText(file.buffer)

    const resume = await resumeRepository.create({
      userId,
      title: title || file.originalname.replace(/\.pdf$/i, ''),
      originalText,
      fileMeta: {
        originalName: file.originalname,
        sizeBytes: file.size,
        mimeType: file.mimetype,
      },
    })

    return resume
  },

  list: (userId: string) => resumeRepository.findByUser(userId),

  getById: async (id: string, userId: string) => {
    const resume = await resumeRepository.findByIdAndUser(id, userId)
    if (!resume) throw new ApiError(404, 'Resume not found')
    return resume
  },

  delete: async (id: string, userId: string) => {
    const resume = await resumeRepository.deleteByIdAndUser(id, userId)
    if (!resume) throw new ApiError(404, 'Resume not found')
    return resume
  },

  analyze: async (id: string, userId: string) => {
    const resume = await resumeRepository.findByIdAndUser(id, userId)
    if (!resume) throw new ApiError(404, 'Resume not found')

    const user = await userRepository.deductCredit(userId)
    if (!user) throw new ApiError(402, 'Insufficient credits')

    await resumeRepository.updateStatus(id, 'analyzing')

    try {
      const { atsScore, feedback } = await geminiService.analyzeResume(resume.originalText)
      const updated = await resumeRepository.updateAnalysis(id, {
        atsScore,
        feedback,
        status: 'completed',
      })
      return updated
    } catch (error) {
      await userRepository.refundCredit(userId)
      await resumeRepository.updateStatus(id, 'failed')
      throw error
    }
  },

  improve: async (id: string, userId: string) => {
    const resume = await resumeRepository.findByIdAndUser(id, userId)
    if (!resume) throw new ApiError(404, 'Resume not found')

    const user = await userRepository.deductCredit(userId)
    if (!user) throw new ApiError(402, 'Insufficient credits')

    await resumeRepository.updateStatus(id, 'improving')

    try {
      const improvedText = await geminiService.improveResume(resume.originalText)
      const updated = await resumeRepository.updateImprovement(id, {
        improvedText,
        status: 'completed',
      })
      return updated
    } catch (error) {
      await userRepository.refundCredit(userId)
      await resumeRepository.updateStatus(id, 'failed')
      throw error
    }
  },
}
