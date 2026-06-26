interface AvatarProps {
  /** Full name — first letter is used as the fallback initial. */
  name: string
  size?: number
  /** Override background (e.g. on dark cards). */
  background?: string
  color?: string
  className?: string
}

/** Circular initial avatar. */
export function Avatar({ name, size = 40, background, color, className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        fontSize: size * 0.4,
        fontWeight: 700,
        background: background ?? '#e5e7eb',
        color: color ?? 'var(--color-navy)',
      }}
      aria-hidden
    >
      {initial}
    </span>
  )
}

export type { AvatarProps }
