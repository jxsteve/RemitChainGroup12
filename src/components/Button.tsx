import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'dark'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const base =
  'inline-flex h-12 select-none items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold ' +
  'transition-[transform,background-color,border-color,box-shadow] duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'active:scale-[.98] disabled:pointer-events-none disabled:active:scale-100'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-sm hover:bg-primary-600 focus-visible:ring-primary ' +
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none',
  outline:
    'border border-primary/50 bg-white text-navy hover:border-primary hover:bg-primary-50 ' +
    'focus-visible:ring-primary disabled:border-gray-200 disabled:bg-white disabled:text-gray-300',
  dark:
    'bg-navy-deep text-white hover:bg-navy focus-visible:ring-navy ' +
    'disabled:bg-gray-100 disabled:text-gray-400',
}

/** Primary action button with primary / outline / dark variants. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', fullWidth, leadingIcon, trailingIcon, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})
