import { Router, Request, Response, NextFunction } from 'express'
import {
  uploadResume,
  listResumes,
  getResume,
  deleteResume,
  analyzeResume,
  improveResume,
} from '../controllers/resume.controller'
import { protect } from '../middlewares/auth.middleware'
import { uploadPdf } from '../middlewares/upload.middleware'
import { aiLimiter, uploadLimiter } from '../middlewares/rateLimit.middleware'

const router = Router()

const handleUpload = (req: Request, res: Response, next: NextFunction): void => {
  uploadPdf(req, res, (err) => {
    if (err) {
      next(err)
      return
    }
    next()
  })
}

router.use(protect)

router.post('/upload', uploadLimiter, handleUpload, uploadResume)
router.get('/', listResumes)
router.get('/:id', getResume)
router.delete('/:id', deleteResume)
router.post('/:id/analyze', aiLimiter, analyzeResume)
router.post('/:id/improve', aiLimiter, improveResume)

export default router
