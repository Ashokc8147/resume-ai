import { ApiError } from '../utils/ApiError'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse')

export const pdfService = {
  extractText: async (buffer: Buffer): Promise<string> => {
    try {
      const data = await pdfParse(buffer)
      const text = data.text?.trim()

      if (!text || text.length < 50) {
        throw new ApiError(
          400,
          'Could not extract enough text from PDF. Ensure it is not scanned/image-only.',
        )
      }

      return text
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(400, 'Failed to parse PDF file')
    }
  },
}
