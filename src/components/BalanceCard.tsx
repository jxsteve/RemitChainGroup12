import { useState } from 'react'
import { Eye, EyeOff, Send } from 'lucide-react'
import { cn } from '../lib/cn'
import styles from './BalanceCard.module.css'

export interface BalanceCardProps {
  /** Pre-formatted balance, e.g. "N250,000.00". */
  balance: string
  accountLabel?: string
  brand?: string
  onSend?: () => void
  className?: string
}

/** Primary account balance card with masking toggle and send action. */
export function BalanceCard({
  balance,
  accountLabel = 'Primary Account',
  brand = 'REMITCHAIN',
  onSend,
  className,
}: BalanceCardProps) {
  const [hidden, setHidden] = useState(false)

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <p className={styles.brand}>{brand}</p>

        <div className={styles.row}>
          <span className={styles.muted}>Available Balance</span>
          <button
            type="button"
            className={styles.eye}
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
          >
            {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <p className={styles.balance}>{hidden ? '••••••••' : balance}</p>

        <div className={styles.bottom}>
          <span className={styles.muted}>{accountLabel}</span>
          <button type="button" className={styles.send} onClick={onSend}>
            <Send size={18} style={{ transform: 'rotate(-12deg)' }} />
            Send Money
          </button>
        </div>
      </div>
    </div>
  )
}
