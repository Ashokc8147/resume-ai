import { Link } from 'react-router-dom'
import { Trash2, ChevronRight } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import type { Resume } from '../../../types'

interface ResumeCardProps {
  resume: Resume
  onDelete: (id: string) => void
}

export const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => (
  <Card className="flex items-center justify-between gap-4 p-4 transition-shadow hover:shadow-md">
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="truncate font-semibold text-slate-900">{resume.title}</h3>
        <Badge status={resume.status} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {new Date(resume.createdAt).toLocaleDateString()}
        {resume.atsScore !== undefined && (
          <span className="ml-2 font-medium text-primary">ATS: {resume.atsScore}/100</span>
        )}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(resume._id)}
        aria-label="Delete resume"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
      <Link to={`/resumes/${resume._id}`}>
        <Button variant="outline" size="sm">
          View
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  </Card>
)
