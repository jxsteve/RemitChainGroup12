import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import styles from './Input.module.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: boolean
  /** Force the focused (green) appearance. */
  focused?: boolean
  /** Content rendered before the input (icon, flag…). */
  leading?: ReactNode
  /** Content rendered after the input (chevron, check…). */
  trailing?: ReactNode
}

/**
 * Form field matching the RemitChain spec.
 * States: default, focus (green), error (red), disabled.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error = false, focused = false, disabled = false, leading, trailing, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={styles.wrap}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={cn(
          styles.field,
          !error && !disabled && focused && styles.focused,
          error && !disabled && styles.error,
          disabled && styles.disabled,
        )}
      >
        {leading && (
          <span className={styles.icon} aria-hidden>
            {leading}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(styles.input, className)}
          {...props}
        />

        {trailing && (
          <span className={styles.icon} aria-hidden>
            {trailing}
          </span>
        )}
      </div>

      {helperText && <p className={cn(styles.help, error && styles.helpError)}>{helperText}</p>}
    </div>
  )
})
