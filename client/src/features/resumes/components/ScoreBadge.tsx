import { cn } from '../../../utils/cn'

interface ScoreBadgeProps {
  score: number
  className?: string
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

export const ScoreBadge = ({ score, className }: ScoreBadgeProps) => (
  <div
    className={cn(
      'inline-flex flex-col items-center rounded-xl border px-6 py-4',
      getScoreColor(score),
      className,
    )}
  >
    <span className="text-3xl font-bold">{score}</span>
    <span className="text-xs font-medium uppercase tracking-wide">ATS Score</span>
  </div>
)
