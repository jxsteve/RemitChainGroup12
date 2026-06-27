import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { BalanceCard } from '../components/BalanceCard'
import { Button } from '../components/Button'
import { TransactionItem } from '../components/TransactionItem'
import { useAuth } from '../lib/auth'
import { useTransfer } from '../lib/transfer'
import { fmtNaira } from '../data/transfer'
import shared from './shared.module.css'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { balance, history } = useTransfer()
  const goToSend = () => navigate('/send')

  return (
    <div className={shared.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.greeting}>Hello, {user?.firstName || 'Mira'}</h1>

        <BalanceCard className={styles.cta} balance={`N${fmtNaira(balance)}.00`} onSend={goToSend} />

        <Button fullWidth className={styles.cta} onClick={goToSend}>
          Send Money
        </Button>

        <h2 className={styles.sectionTitle}>Recent Transaction</h2>
        <div className={styles.list}>
          {history.slice(0, 2).map((tx) => (
            <TransactionItem
              key={tx.id}
              name={tx.name}
              date={tx.date}
              amount={tx.amount}
              status={tx.status}
              onClick={() => navigate('/activity')}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
