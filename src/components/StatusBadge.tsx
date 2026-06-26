import { Check } from 'lucide-react'
import { cn } from '../lib/cn'

export type TransactionStatus = 'completed' | 'processing' | 'failed'

export interface StatusBadgeProps {
  status: TransactionStatus
  className?: string
}

const labels: Record<TransactionStatus, string> = {
  completed: 'Completed',
  processing: 'Processing',
  failed: 'Failed',
}

/** Pill indicating transaction state. Failed renders as a solid bar per spec. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === 'failed') {
    return (
      <span
        role="status"
        className={cn('inline-flex h-6 w-28 items-center rounded-md bg-danger', className)}
      >
        <span className="sr-only">{labels.failed}</span>
      </span>
    )
  }

  const tone = status === 'completed' ? 'bg-success' : 'bg-warning'

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-white',
        tone,
        className,
      )}
    >
      <Check size={13} strokeWidth={3} />
      {labels[status]}
    </span>
  )
}
