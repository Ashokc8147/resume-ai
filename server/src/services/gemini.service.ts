import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { ApiError } from '../utils/ApiError'
import { IResumeFeedback } from '../models/Resume'

const getModel = () => {
  if (!env.geminiApiKey) {
    throw new ApiError(503, 'AI service is not configured. Add GEMINI_API_KEY to server environment.')
  }
  const genAI = new GoogleGenerativeAI(env.geminiApiKey)
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

const parseJsonResponse = <T>(text: string): T => {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned) as T
}

export const geminiService = {
  analyzeResume: async (
    resumeText: string,
  ): Promise<{ atsScore: number; feedback: IResumeFeedback }> => {
    const model = getModel()

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer.
Analyze the following resume text and respond ONLY with valid JSON in this exact shape:
{
  "atsScore": <number 0-100>,
  "feedback": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "suggestions": ["..."]
  }
}
Provide 3-5 items per array. Be specific and actionable.

Resume:
${resumeText.slice(0, 12000)}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const parsed = parseJsonResponse<{ atsScore: number; feedback: IResumeFeedback }>(response)

    return {
      atsScore: Math.min(100, Math.max(0, Math.round(parsed.atsScore))),
      feedback: parsed.feedback,
    }
  },

  improveResume: async (resumeText: string): Promise<string> => {
    const model = getModel()

    const prompt = `You are a professional resume writer. Rewrite and improve the following resume.
Rules:
- Keep factual content accurate; do not invent experience
- Use strong action verbs and quantifiable achievements where present
- Optimize for ATS readability with clear sections
- Return ONLY the improved resume text, no markdown fences or commentary

Original resume:
${resumeText.slice(0, 12000)}`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  },
}
