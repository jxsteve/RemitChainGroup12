import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { TransactionItem } from '../components/TransactionItem'
import { RECENT_TRANSACTIONS } from '../data/transfer'
import styles from './Activity.module.css'

/** Transaction history — the real destination for the Activity tab. */
export default function Activity() {
  const navigate = useNavigate()

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.title}>Activity</h1>
        <p className={styles.subtitle}>Your recent transfers</p>

        <div className={styles.list}>
          {RECENT_TRANSACTIONS.map((tx) => (
            <TransactionItem
              key={tx.id}
              name={tx.name}
              date={tx.date}
              amount={tx.amount}
              status={tx.status}
              onClick={() => navigate('/send')}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
