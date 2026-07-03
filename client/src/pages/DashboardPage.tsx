import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { UploadZone } from '../features/resumes/components/UploadZone'
import { ResumeCard } from '../features/resumes/components/ResumeCard'
import { EmptyState } from '../components/feedback/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { resumeService } from '../services/resume.service'
import { useAuthStore } from '../store/authStore'
import type { Resume } from '../types'

export const DashboardPage = () => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const refreshUser = useAuthStore((s) => s.refreshUser)

  const fetchResumes = async () => {
    try {
      const data = await resumeService.list()
      setResumes(data)
    } catch {
      toast.error('Failed to load resumes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
    refreshUser()
  }, [refreshUser])

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const resume = await resumeService.upload(file)
      setResumes((prev) => [resume, ...prev])
      toast.success('Resume uploaded successfully')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Upload failed'
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return
    try {
      await resumeService.delete(id)
      setResumes((prev) => prev.filter((r) => r._id !== id))
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete resume')
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-600">Upload and manage your resumes</p>
        </div>

        <UploadZone onUpload={handleUpload} isUploading={isUploading} />

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Your resumes</h2>
          {isLoading ? (
            <Spinner label="Loading resumes..." />
          ) : resumes.length === 0 ? (
            <EmptyState
              title="No resumes yet"
              description="Upload your first PDF resume above to get started with AI analysis."
            />
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <ResumeCard key={resume._id} resume={resume} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
