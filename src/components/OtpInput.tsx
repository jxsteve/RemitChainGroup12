import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '../lib/cn'
import styles from './OtpInput.module.css'

export interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  /** Fired when every box is filled. */
  onComplete?: (value: string) => void
}

/** Segmented 6-digit code input with auto-advance, backspace and paste. */
export function OtpInput({ length = 6, value, onChange, onComplete }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const setDigit = (index: number, digit: string) => {
    const chars = value.split('')
    chars[index] = digit
    const next = chars.join('').slice(0, length)
    onChange(next)
    // `next` only reaches full length when every box is filled (a gap shortens
    // the joined string), so this also guards against missing digits.
    if (next.length === length) {
      onComplete?.(next)
    }
  }

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (!digit) return
    setDigit(index, digit)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[index]) {
        setDigit(index, '')
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
        setDigit(index - 1, '')
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    onChange(digits)
    const focusIndex = Math.min(digits.length, length - 1)
    refs.current[focusIndex]?.focus()
    if (digits.length === length) onComplete?.(digits)
  }

  return (
    <div className={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className={cn(styles.box, value[i] && styles.filled)}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  )
}
