import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { ScoreBadge } from '../features/resumes/components/ScoreBadge'
import { FeedbackPanel } from '../features/resumes/components/FeedbackPanel'
import { resumeService } from '../services/resume.service'
import { useAuthStore } from '../store/authStore'
import type { Resume } from '../types'

export const ResumeDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [resume, setResume] = useState<Resume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const refreshUser = useAuthStore((s) => s.refreshUser)
  const user = useAuthStore((s) => s.user)

  const fetchResume = async () => {
    if (!id) return
    try {
      const data = await resumeService.getById(id)
      setResume(data)
    } catch {
      toast.error('Resume not found')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [id])

  const handleAnalyze = async () => {
    if (!id) return
    setIsAnalyzing(true)
    try {
      const updated = await resumeService.analyze(id)
      setResume(updated)
      await refreshUser()
      toast.success('Analysis complete!')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Analysis failed'
      toast.error(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImprove = async () => {
    if (!id) return
    setIsImproving(true)
    try {
      const updated = await resumeService.improve(id)
      setResume(updated)
      await refreshUser()
      toast.success('Resume improved!')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Improvement failed'
      toast.error(message)
    } finally {
      setIsImproving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Spinner label="Loading resume..." />
      </DashboardLayout>
    )
  }

  if (!resume) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p className="text-slate-600">Resume not found.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isProcessing = resume.status === 'analyzing' || resume.status === 'improving'

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{resume.title}</h1>
              <Badge status={resume.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Uploaded {new Date(resume.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              disabled={isProcessing || (user?.credits ?? 0) < 1}
              variant="outline"
            >
              <Sparkles className="h-4 w-4" />
              Analyze ATS (1 credit)
            </Button>
            <Button
              onClick={handleImprove}
              isLoading={isImproving}
              disabled={isProcessing || (user?.credits ?? 0) < 1}
            >
              <Wand2 className="h-4 w-4" />
              Improve (1 credit)
            </Button>
          </div>
        </div>

        {resume.atsScore !== undefined && (
          <div className="mt-8">
            <ScoreBadge score={resume.atsScore} />
          </div>
        )}

        {resume.feedback && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">AI Feedback</h2>
            <FeedbackPanel feedback={resume.feedback} />
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 font-semibold text-slate-900">Original Text</h2>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-sm text-slate-600">
              {resume.originalText}
            </pre>
          </Card>

          {resume.improvedText && (
            <Card>
              <h2 className="mb-3 font-semibold text-slate-900">Improved Version</h2>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-sm text-slate-600">
                {resume.improvedText}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
