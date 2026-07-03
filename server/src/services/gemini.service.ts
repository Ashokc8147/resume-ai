import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { ApiError } from '../utils/ApiError'
import { IResumeFeedback } from '../models/Resume'

const getModel = () => {
  if (!env.geminiApiKey) {
    throw new ApiError(
      503,
      'AI service is not configured. Add GEMINI_API_KEY to server environment.'
    )
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey)

  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  })
}

const parseJsonResponse = <T>(text: string): T => {
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(cleaned) as T
}

export const geminiService = {
  analyzeResume: async (
    resumeText: string,
  ): Promise<{ atsScore: number; feedback: IResumeFeedback }> => {
    const model = getModel()

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the following resume and return ONLY valid JSON.

Format:

{
  "atsScore": 85,
  "feedback": {
    "strengths": [
      "...",
      "...",
      "..."
    ],
    "weaknesses": [
      "...",
      "...",
      "..."
    ],
    "suggestions": [
      "...",
      "...",
      "..."
    ]
  }
}

Rules:
- Do NOT use markdown.
- Do NOT wrap JSON inside \`\`\`.
- Return ONLY JSON.

Resume:

${resumeText.slice(0, 12000)}
`

    try {
      const result = await model.generateContent(prompt)

      const response = result.response.text()

      console.log("========== GEMINI RESPONSE ==========")
      console.log(response)
      console.log("=====================================")

      const parsed = parseJsonResponse<{
        atsScore: number
        feedback: IResumeFeedback
      }>(response)

      return {
        atsScore: Math.min(
          100,
          Math.max(0, Math.round(parsed.atsScore))
        ),
        feedback: parsed.feedback,
      }
    } catch (error) {
      console.error("========== GEMINI ANALYZE ERROR ==========")
      console.error(error)
      console.error("==========================================")

      throw error
    }
  },

  improveResume: async (resumeText: string): Promise<string> => {
    const model = getModel()

    const prompt = `
You are a professional resume writer.

Rewrite the resume.

Rules:

- Improve grammar.
- Improve ATS score.
- Do not invent experience.
- Keep all factual information.
- Return ONLY the improved resume text.
- No markdown.
- No explanation.

Resume:

${resumeText.slice(0, 12000)}
`

    try {
      const result = await model.generateContent(prompt)

      const response = result.response.text()

      console.log("========== IMPROVED RESUME ==========")
      console.log(response)
      console.log("====================================")

      return response.trim()
    } catch (error) {
      console.error("========== GEMINI IMPROVE ERROR ==========")
      console.error(error)
      console.error("==========================================")

      throw error
    }
  },
}