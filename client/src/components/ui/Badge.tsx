import { cn } from '../../utils/cn'
import type { ResumeStatus } from '../../types'

const statusStyles: Record<ResumeStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  analyzing: 'bg-amber-100 text-amber-800',
  improving: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
}

interface BadgeProps {
  status: ResumeStatus
  className?: string
}

export const Badge = ({ status, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
      statusStyles[status],
      className,
    )}
  >
    {status}
  </span>
)
