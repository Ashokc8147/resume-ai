import { api } from './api'
import type { ApiResponse, Resume } from '../types'

export const resumeService = {
  upload: async (file: File, title?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (title) formData.append('title', title)

    const { data } = await api.post<ApiResponse<Resume>>('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data!
  },

  list: async () => {
    const { data } = await api.get<ApiResponse<Resume[]>>('/resumes')
    return data.data!
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Resume>>(`/resumes/${id}`)
    return data.data!
  },

  delete: async (id: string) => {
    await api.delete(`/resumes/${id}`)
  },

  analyze: async (id: string) => {
    const { data } = await api.post<ApiResponse<Resume>>(`/resumes/${id}/analyze`)
    return data.data!
  },

  improve: async (id: string) => {
    const { data } = await api.post<ApiResponse<Resume>>(`/resumes/${id}/improve`)
    return data.data!
  },
}
