import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type ChipVariant = 'default' | 'selected' | 'dark'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant
}

const variants: Record<ChipVariant, string> = {
  default: 'border border-gray-200 bg-gray-50 text-navy hover:bg-gray-100',
  selected: 'bg-primary text-white shadow-sm',
  dark: 'bg-navy-deep text-white',
}

/** Selectable pill (e.g. country / corridor selector). */
export function Chip({ variant = 'default', className, children, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold',
        'transition-[transform,background-color] duration-150 active:scale-[.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
