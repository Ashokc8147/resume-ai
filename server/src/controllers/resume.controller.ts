import { Request, Response } from 'express'
import { resumeService } from '../services/resume.service'
import { sendSuccess } from '../utils/response'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, 'PDF file is required')

  const resume = await resumeService.upload(
    req.user!._id.toString(),
    req.file,
    req.body.title,
  )

  sendSuccess(res, resume, 'Resume uploaded successfully', 201)
})

export const listResumes = asyncHandler(async (req: Request, res: Response) => {
  const resumes = await resumeService.list(req.user!._id.toString())
  sendSuccess(res, resumes)
})

export const getResume = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const resume = await resumeService.getById(id, req.user!._id.toString())
  sendSuccess(res, resume)
})

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string
  await resumeService.delete(id, req.user!._id.toString())
  sendSuccess(res, null, 'Resume deleted successfully')
})

export const analyzeResume = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const resume = await resumeService.analyze(id, req.user!._id.toString())
  sendSuccess(res, resume, 'Resume analyzed successfully')
})

export const improveResume = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const resume = await resumeService.improve(id, req.user!._id.toString())
  sendSuccess(res, resume, 'Resume improved successfully')
})
