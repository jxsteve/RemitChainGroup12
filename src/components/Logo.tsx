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
