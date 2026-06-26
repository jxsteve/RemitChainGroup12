import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './ScreenHeader.module.css'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  /** Where the back arrow goes. Defaults to browser back. */
  onBack?: () => void
}

/** Back arrow + centered title (with optional subtitle) for inner screens. */
export default function ScreenHeader({ title, subtitle, onBack }: ScreenHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.back}
          aria-label="Go back"
          onClick={() => (onBack ? onBack() : navigate(-1))}
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}
