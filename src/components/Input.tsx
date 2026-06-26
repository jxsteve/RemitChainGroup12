import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '../lib/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: boolean
  /** Force the focused (green) appearance — useful for documentation/states. */
  focused?: boolean
  leadingIcon?: ReactNode
  /** Show a trailing dropdown chevron (e.g. for select-style fields). */
  withChevron?: boolean
}

/**
 * Text / select field matching the RemitChain form spec.
 * Supports default, focus (green), error (red) and disabled states.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error = false,
    focused = false,
    disabled = false,
    leadingIcon = <Search size={18} />,
    withChevron = true,
    className,
    id,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  const field = cn(
    'flex h-[52px] items-center gap-2.5 rounded-xl border px-3.5 transition-[background-color,border-color,box-shadow] duration-150',
    // resting + interactive focus state
    !error &&
      !disabled &&
      'border-gray-200 bg-gray-50 focus-within:border-success focus-within:bg-white focus-within:shadow-focus',
    // forced focus (docs)
    !error && !disabled && focused && 'border-success bg-white shadow-focus',
    // error
    error && !disabled && 'border-danger bg-white shadow-error',
    // disabled
    disabled && 'border-gray-200 bg-gray-50 opacity-70',
  )

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-navy">
          {label}
        </label>
      )}

      <div className={field}>
        {leadingIcon && (
          <span className={cn('shrink-0', disabled ? 'text-gray-300' : 'text-gray-400')} aria-hidden>
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(
            'w-full bg-transparent text-sm font-medium text-navy outline-none',
            'placeholder:font-medium placeholder:text-gray-400 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />

        {withChevron && (
          <ChevronDown size={18} className={cn('shrink-0', disabled ? 'text-gray-300' : 'text-gray-400')} aria-hidden />
        )}
      </div>

      {helperText && (
        <p className={cn('mt-1.5 text-xs font-medium', error ? 'text-danger' : 'text-gray-400')}>{helperText}</p>
      )}
    </div>
  )
})
