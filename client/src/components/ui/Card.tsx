import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export const Card = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
