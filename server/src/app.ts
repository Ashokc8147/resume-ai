import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import authRoutes from './routes/auth.routes'
import resumeRoutes from './routes/resume.routes'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'

const app: Application = express()

app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ResumeAI API is running',
    environment: env.nodeEnv,
  })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/resumes', resumeRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
