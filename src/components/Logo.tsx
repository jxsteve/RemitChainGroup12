interface LogoProps {
  /** Height of the wordmark in pixels. */
  size?: number
  /** Light variant for dark backgrounds. */
  variant?: 'default' | 'light'
  className?: string
}

/**
 * RemitChain wordmark — "Remit" in brand navy and "chain" in brand blue,
 * with the chain-link glyph replacing the "a".
 */
export function Logo({ size = 28, variant = 'default', className }: LogoProps) {
  const remitColor = variant === 'light' ? '#ffffff' : 'var(--color-navy)'

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        userSelect: 'none',
      }}
      aria-label="RemitChain"
    >
      <span style={{ color: remitColor }}>Remit</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-accent)' }}>
        chain
      </span>
    </span>
  )
}

function ChainLink({ size }: { size: number }) {
  const s = size * 0.78
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden style={{ margin: `0 ${size * 0.01}px` }}>
      <circle cx="12" cy="12" r="7" stroke="#2563eb" strokeWidth="3.4" />
      <circle cx="12" cy="12" r="2.4" fill="#2563eb" />
    </svg>
  )
}
