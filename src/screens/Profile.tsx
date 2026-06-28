import { useNavigate } from 'react-router-dom'
import { ChevronRight, User, Wallet, Shield, CircleHelp, LogOut, type LucideIcon } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import BottomNav from '../components/BottomNav'
import { Avatar } from '../components/Avatar'
import { useAuth } from '../lib/auth'
import { privyProfile } from '../lib/privy'
import styles from './Profile.module.css'

interface Item {
  label: string
  icon: LucideIcon
  to: string
}

const ITEMS: Item[] = [
  { label: 'Account details', icon: User, to: '/home' },
  { label: 'My wallet', icon: Wallet, to: '/wallet' },
  { label: 'Security & PIN', icon: Shield, to: '/create-pin' },
  { label: 'Help & support', icon: CircleHelp, to: '/home' },
]

/** Basic profile screen — gives the Profile tab a real destination. */
export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { user: privyUser, authenticated, logout: privyLogout } = usePrivy()

  // Prefer the real Privy identity, fall back to the mock onboarding session.
  const p = privyProfile(privyUser)
  const fullName =
    (authenticated && p.name) ||
    (user ? `${user.firstName} ${user.lastName}`.trim() : 'Mira Igboanusi')
  const email = (authenticated && (p.email ?? p.phone)) || user?.email || 'miracleigboanusi@gmail.com'

  const handleLogout = async () => {
    logout()
    if (authenticated) await privyLogout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.title}>Profile</h1>

        <div className={styles.card}>
          <Avatar name={fullName} size={56} />
          <div>
            <p className={styles.name}>{fullName}</p>
            <p className={styles.email}>{email}</p>
          </div>
        </div>

        <div className={styles.list}>
          {ITEMS.map(({ label, icon: Icon, to }) => (
            <button key={label} className={styles.row} onClick={() => navigate(to)}>
              <span className={styles.rowIcon}>
                <Icon size={18} />
              </span>
              <span className={styles.rowLabel}>{label}</span>
              <ChevronRight size={18} color="var(--color-text-subtle)" />
            </button>
          ))}
        </div>

        <button className={styles.logout} onClick={handleLogout}>
          <LogOut size={18} />
          Log out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
