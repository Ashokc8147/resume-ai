import { CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { cn } from '../../../utils/cn'
import type { ResumeFeedback } from '../../../types'

interface FeedbackPanelProps {
  feedback: ResumeFeedback
}

const ListSection = ({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string
  items: string[]
  icon: typeof CheckCircle2
  color: string
}) => (
  <Card>
    <div className="mb-3 flex items-center gap-2">
      <Icon className={cn('h-5 w-5', color)} />
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-600">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          {item}
        </li>
      ))}
    </ul>
  </Card>
)

export const FeedbackPanel = ({ feedback }: FeedbackPanelProps) => (
  <div className="grid gap-4 md:grid-cols-3">
    <ListSection
      title="Strengths"
      items={feedback.strengths}
      icon={CheckCircle2}
      color="text-emerald-600"
    />
    <ListSection
      title="Weaknesses"
      items={feedback.weaknesses}
      icon={AlertCircle}
      color="text-amber-600"
    />
    <ListSection
      title="Suggestions"
      items={feedback.suggestions}
      icon={Lightbulb}
      color="text-primary"
    />
  </div>
)
