import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, Home, Navigation, User, type LucideIcon } from 'lucide-react'
import { cn } from '../lib/cn'
import styles from './BottomNav.module.css'

interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  /** Routes that render this tab active. */
  matches: string[]
}

const ITEMS: NavItem[] = [
  { label: 'Home', icon: Home, to: '/home', matches: ['/home'] },
  // Send stays active while choosing recipient + amount, per the design.
  { label: 'Send', icon: Navigation, to: '/send', matches: ['/send', '/amount'] },
  // Activity opens the transaction history, and is active on review / track.
  { label: 'Activity', icon: Clock, to: '/activity', matches: ['/activity', '/review', '/track'] },
  { label: 'Profile', icon: User, to: '/profile', matches: ['/profile'] },
]

/** Persistent bottom tab bar. Active tab shows a filled navy icon + label. */
export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map(({ label, icon: Icon, to, matches }) => {
        const active = matches.includes(pathname)
        return (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to)}
            aria-current={active ? 'page' : undefined}
            className={cn(styles.tab, active && styles.active)}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.25 : 2}
              fill={active ? 'currentColor' : 'none'}
              stroke={active ? '#fff' : 'currentColor'}
            />
            <span className={styles.label}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
