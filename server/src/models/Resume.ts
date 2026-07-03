import mongoose, { Document, Schema, Types } from 'mongoose'

export type ResumeStatus =
  | 'pending'
  | 'analyzing'
  | 'improving'
  | 'completed'
  | 'failed'

export interface IResumeFeedback {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface IResume extends Document {
  userId: Types.ObjectId
  title: string
  originalText: string
  improvedText?: string
  atsScore?: number
  feedback?: IResumeFeedback
  status: ResumeStatus
  fileMeta?: {
    originalName: string
    sizeBytes: number
    mimeType: string
  }
  createdAt: Date
  updatedAt: Date
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    originalText: { type: String, required: true },
    improvedText: { type: String },
    atsScore: { type: Number, min: 0, max: 100 },
    feedback: {
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'improving', 'completed', 'failed'],
      default: 'pending',
    },
    fileMeta: {
      originalName: String,
      sizeBytes: Number,
      mimeType: String,
    },
  },
  { timestamps: true },
)

ResumeSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model<IResume>('Resume', ResumeSchema)
