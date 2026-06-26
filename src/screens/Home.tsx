import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { BalanceCard } from '../components/BalanceCard'
import { Button } from '../components/Button'
import { TransactionItem } from '../components/TransactionItem'
import { AVAILABLE_BALANCE, RECENT_TRANSACTIONS } from '../data/transfer'
import shared from './shared.module.css'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const goToSend = () => navigate('/send')

  return (
    <div className={shared.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.greeting}>Hello, Mira</h1>

        <BalanceCard className={styles.cta} balance={AVAILABLE_BALANCE} onSend={goToSend} />

        <Button fullWidth className={styles.cta} onClick={goToSend}>
          Send Money
        </Button>

        <h2 className={styles.sectionTitle}>Recent Transaction</h2>
        <div className={styles.list}>
          {RECENT_TRANSACTIONS.map((tx) => (
            <TransactionItem key={tx.id} name={tx.name} date={tx.date} amount={tx.amount} status={tx.status} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
