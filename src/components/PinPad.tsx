import { Delete } from 'lucide-react'
import { cn } from '../lib/cn'
import styles from './PinPad.module.css'

export interface PinPadProps {
  length?: number
  value: string
  onChange: (value: string) => void
  /** Fired when the pin reaches the required length. */
  onComplete?: (value: string) => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'] as const

/** Masked dots + numeric keypad for creating / entering a PIN. */
export function PinPad({ length = 6, value, onChange, onComplete }: PinPadProps) {
  const press = (key: (typeof KEYS)[number]) => {
    if (key === '') return
    if (key === 'back') {
      onChange(value.slice(0, -1))
      return
    }
    if (value.length >= length) return
    const next = value + key
    onChange(next)
    if (next.length === length) onComplete?.(next)
  }

  return (
    <div>
      <div className={styles.dots}>
        {Array.from({ length }).map((_, i) => (
          <span key={i} className={cn(styles.dot, i < value.length && styles.dotFilled)} />
        ))}
      </div>

      <div className={styles.pad} style={{ marginTop: 40 }}>
        {KEYS.map((key, i) =>
          key === '' ? (
            <span key={i} className={cn(styles.key, styles.empty)} aria-hidden />
          ) : (
            <button
              key={i}
              type="button"
              className={cn(styles.key, key === 'back' && styles.back)}
              onClick={() => press(key)}
              aria-label={key === 'back' ? 'Delete' : key}
            >
              {key === 'back' ? <Delete size={24} /> : key}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
