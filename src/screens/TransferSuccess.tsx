import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '../components/Button'
import styles from './TransferSuccess.module.css'

/** Confirmation shown once the simulated transfer completes. */
export default function TransferSuccess() {
  const navigate = useNavigate()

  return (
    <div className={styles.screen}>
      <div className={styles.body}>
        <div className={styles.badge}>
          <Check size={44} strokeWidth={3} />
        </div>

        <h1 className={styles.title}>Transfer Successful</h1>
        <p className={styles.subtitle}>Your money is on its way to Ayo</p>

        <div className={styles.summary}>
          <div className={styles.row}>
            <span className={styles.label}>Amount sent</span>
            <span className={styles.value}>N100,000.00</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Recipient</span>
            <span className={styles.value}>Ayo</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Country</span>
            <span className={styles.value}>Ghana</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>They receive</span>
            <span className={styles.value}>GHS 950.00</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={() => navigate('/home')}>
          Back to Home
        </Button>
        <button className={styles.secondary} onClick={() => navigate('/activity')}>
          View Activity
        </button>
      </div>
    </div>
  )
}
