import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { ApiError } from '../utils/ApiError'
import { IResumeFeedback } from '../models/Resume'

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

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

async function generateWithRetry(model: any, prompt: string) {
  let lastError: any

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await model.generateContent(prompt)
    } catch (error: any) {
      lastError = error

      console.log(`Gemini attempt ${attempt} failed.`)

      if (error?.status === 503 && attempt < 3) {
        console.log('Gemini is busy. Waiting 3 seconds before retry...')
        await sleep(3000)
        continue
      }

      throw error
    }
  }

  throw lastError
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
    "strengths": ["..."],
    "weaknesses": ["..."],
    "suggestions": ["..."]
  }
}

Rules:
- Return ONLY JSON.
- No markdown.

Resume:

${resumeText.slice(0, 12000)}
`

    try {
      const result = await generateWithRetry(model, prompt)

      const response = result.response.text()

      console.log('========== GEMINI RESPONSE ==========')
      console.log(response)
      console.log('=====================================')

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
      console.error('========== GEMINI ANALYZE ERROR ==========')
      console.error(error)
      console.error('==========================================')

      throw error
    }
  },

  improveResume: async (resumeText: string): Promise<string> => {
    const model = getModel()

    const prompt = `
You are a professional resume writer.

Rewrite and improve the following resume.

Rules:

- Improve grammar.
- Improve ATS score.
- Keep all factual information.
- Do NOT invent projects or experience.
- Return ONLY the improved resume.
- No markdown.
- No explanations.

Resume:

${resumeText.slice(0, 12000)}
`

    try {
      const result = await generateWithRetry(model, prompt)

      const response = result.response.text()

      console.log('========== IMPROVED RESUME ==========')
      console.log(response)
      console.log('====================================')

      return response.trim()
    } catch (error) {
      console.error('========== GEMINI IMPROVE ERROR ==========')
      console.error(error)
      console.error('==========================================')

      throw error
    }
  },
}