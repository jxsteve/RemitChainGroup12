import { cn } from '../lib/cn'

interface LogoProps {
  /** Height of the wordmark in pixels. */
  size?: number
  /** Use the light wordmark for dark backgrounds. */
  variant?: 'default' | 'light'
  className?: string
}

/**
 * RemitChain wordmark — "Remit" in brand navy and "chain" in brand blue,
 * with the chain-link glyph standing in for the "a".
 */
export function Logo({ size = 28, variant = 'default', className }: LogoProps) {
  const remitColor = variant === 'light' ? '#FFFFFF' : '#0B1A4A'

  return (
    <span
      className={cn('inline-flex select-none items-center font-extrabold tracking-tight', className)}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-label="RemitChain"
    >
      <span style={{ color: remitColor }}>Remit</span>
      <span className="inline-flex items-center" style={{ color: '#2563EB' }}>
        ch
        <ChainLink size={size} />
        in
      </span>
    </span>
  )
}

/** The interlocking "a" rendered as a chain link. */
function ChainLink({ size }: { size: number }) {
  const s = size * 0.78
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ margin: `0 ${size * 0.02}px`, transform: 'translateY(2%)' }}
    >
      <circle cx="12" cy="12" r="7" stroke="#2563EB" strokeWidth="3.4" />
      <circle cx="12" cy="12" r="2.4" fill="#2563EB" />
    </svg>
  )
}
