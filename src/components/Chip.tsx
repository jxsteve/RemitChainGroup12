import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'
import type { ChipVariant } from '../types'
import styles from './Chip.module.css'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant
}

/** Selectable pill — default / selected (blue) / dark (navy). */
export function Chip({ variant = 'default', className, children, type = 'button', ...props }: ChipProps) {
  return (
    <button type={type} className={cn(styles.chip, styles[variant], className)} {...props}>
      {children}
    </button>
  )
}
