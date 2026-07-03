import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export const Spinner = ({ className, label = 'Loading...' }: SpinnerProps) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm text-slate-500">{label}</p>
  </div>
)
