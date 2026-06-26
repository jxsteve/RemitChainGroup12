import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { cn } from '../lib/cn'
import styles from './ReviewTransfer.module.css'
import shared from './shared.module.css'

interface Row {
  label: string
  value: string
  small?: boolean
}

const ROWS: Row[] = [
  { label: 'You send', value: 'N100,000.00' },
  { label: 'Transfer fee', value: 'N1,500.00' },
  { label: 'Exchange Rate', value: '1 NGN = 0.0095 GHS', small: true },
  { label: 'Recipient Receives', value: 'GHS 950.00' },
  { label: 'Recipient', value: 'Ayo' },
  { label: 'Country', value: 'Ghana' },
  { label: 'Estimated Arrival', value: 'Less than 2 minutes', small: true },
]

export default function ReviewTransfer() {
  const navigate = useNavigate()

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Review Transfer" />

      <div className={styles.scroll}>
        <div className={styles.card}>
          {ROWS.map((row) => (
            <div key={row.label} className={cn(styles.row, row.small && styles.small)}>
              <span className={styles.label}>{row.label}</span>
              <span className={styles.value}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={() => navigate('/processing')}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
