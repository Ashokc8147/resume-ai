export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string>
}

export interface User {
  _id: string
  name: string
  email: string
  credits: number
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type ResumeStatus =
  | 'pending'
  | 'analyzing'
  | 'improving'
  | 'completed'
  | 'failed'

export interface ResumeFeedback {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface Resume {
  _id: string
  userId: string
  title: string
  originalText: string
  improvedText?: string
  atsScore?: number
  feedback?: ResumeFeedback
  status: ResumeStatus
  fileMeta?: {
    originalName: string
    sizeBytes: number
    mimeType: string
  }
  createdAt: string
  updatedAt: string
}
