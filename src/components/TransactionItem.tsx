import { cn } from '../lib/cn'
import { Avatar } from './Avatar'
import { StatusBadge, type TransactionStatus } from './StatusBadge'

export interface TransactionItemProps {
  name: string
  /** Pre-formatted date string, e.g. "25 Jun 2026". */
  date: string
  /** Pre-formatted amount string, e.g. "N100,000". */
  amount: string
  status: TransactionStatus
  onClick?: () => void
  className?: string
}

/** Dark transaction row: avatar, recipient, amount and status. */
export function TransactionItem({ name, date, amount, status, onClick, className }: TransactionItemProps) {
  const interactive = Boolean(onClick)
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick?.() : undefined}
      className={cn(
        'rounded-2xl bg-surface-dark p-4 text-white',
        interactive && 'cursor-pointer transition-transform duration-150 hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} size={36} className="bg-white/15 text-white" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight">{name}</p>
          <p className="text-xs font-medium text-white/45">{date}</p>
        </div>
      </div>

      <p className="mt-3 text-xl font-extrabold tracking-tight">{amount}</p>

      <div className="mt-2.5">
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
