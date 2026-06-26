import { cn } from '../lib/cn'

export interface AvatarProps {
  /** Full name — the first letter is used as the fallback initial. */
  name: string
  size?: number
  className?: string
}

/** Circular initial avatar used in transaction rows and headers. */
export function Avatar({ name, size = 40, className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-navy',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden
    >
      {initial}
    </span>
  )
}
