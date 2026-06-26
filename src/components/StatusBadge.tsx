import { Check } from 'lucide-react'
import { cn } from '../lib/cn'
import type { TransactionStatus } from '../types'
import styles from './StatusBadge.module.css'

export interface StatusBadgeProps {
  status: TransactionStatus
  className?: string
}

const labels: Record<TransactionStatus, string> = {
  completed: 'Completed',
  processing: 'Processing',
  failed: 'Failed',
}

/** Transaction status pill. Failed renders as a solid bar. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === 'failed') {
    return (
      <span role="status" className={cn(styles.failed, className)}>
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          {labels.failed}
        </span>
      </span>
    )
  }

  return (
    <span role="status" className={cn(styles.badge, styles[status], className)}>
      <Check size={13} strokeWidth={3} />
      {labels[status]}
    </span>
  )
}
