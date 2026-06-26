import { useState } from 'react'
import { Eye, EyeOff, Send } from 'lucide-react'
import { cn } from '../lib/cn'

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
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 text-white shadow-card',
        'bg-gradient-to-br from-primary to-primary-600',
        className,
      )}
    >
      {/* Decorative depth */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        <p className="text-sm font-bold tracking-wide">{brand}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-white/80">Available Balance</p>
          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            className="rounded-full p-1 text-white/90 transition-colors hover:bg-white/10"
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
          >
            {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <p className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums">
          {hidden ? '••••••••' : balance}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-sm font-medium text-white/80">{accountLabel}</p>
          <button
            type="button"
            onClick={onSend}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-150 hover:translate-x-0.5"
          >
            <Send size={18} className="-rotate-12" />
            Send Money
          </button>
        </div>
      </div>
    </div>
  )
}
