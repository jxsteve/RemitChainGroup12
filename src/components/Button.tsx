import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { ButtonVariant } from '../types'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

/** Primary action button — primary / outline / dark variants. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', fullWidth, leadingIcon, trailingIcon, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.btn, styles[variant], fullWidth && styles.full, className)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})
