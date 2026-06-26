import { cn } from '../lib/cn'
import type { TransactionStatus } from '../types'
import { Avatar } from './Avatar'
import { StatusBadge } from './StatusBadge'
import styles from './TransactionItem.module.css'

export interface TransactionItemProps {
  name: string
  date: string
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
      className={cn(styles.item, interactive && styles.clickable, className)}
    >
      <div className={styles.top}>
        <Avatar name={name} size={36} background="rgba(255,255,255,0.16)" color="#fff" />
        <div className={styles.meta}>
          <p className={styles.name}>{name}</p>
          <p className={styles.date}>{date}</p>
        </div>
      </div>

      <p className={styles.amount}>{amount}</p>

      <div className={styles.badgeRow}>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
