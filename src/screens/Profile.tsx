import { useNavigate } from 'react-router-dom'
import { ChevronRight, User, Shield, CircleHelp, LogOut, type LucideIcon } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { Avatar } from '../components/Avatar'
import styles from './Profile.module.css'

interface Item {
  label: string
  icon: LucideIcon
  to: string
}

const ITEMS: Item[] = [
  { label: 'Account details', icon: User, to: '/home' },
  { label: 'Security & PIN', icon: Shield, to: '/create-pin' },
  { label: 'Help & support', icon: CircleHelp, to: '/home' },
]

/** Basic profile screen — gives the Profile tab a real destination. */
export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.title}>Profile</h1>

        <div className={styles.card}>
          <Avatar name="Mira" size={56} />
          <div>
            <p className={styles.name}>Mira Igboanusi</p>
            <p className={styles.email}>miracleigboanusi@gmail.com</p>
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

        <button className={styles.logout} onClick={() => navigate('/')}>
          <LogOut size={18} />
          Log out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
