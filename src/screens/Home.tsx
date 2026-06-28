import { useNavigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
import { Wallet as WalletIcon, ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { BalanceCard } from '../components/BalanceCard'
import { Button } from '../components/Button'
import { TransactionItem } from '../components/TransactionItem'
import { useAuth } from '../lib/auth'
import { useTransfer } from '../lib/transfer'
import { useWallet } from '../lib/walletStore'
import { fmtNaira } from '../data/transfer'
import { fmtUsdc } from '../lib/wallet'
import { privyProfile } from '../lib/privy'
import shared from './shared.module.css'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { user: privyUser, authenticated } = usePrivy()
  const { balance, history } = useTransfer()
  const { balance: walletBalance, asset } = useWallet()
  const goToSend = () => navigate('/send')

  // Greet by the real Privy identity when signed in, else the mock session.
  const greetName =
    (authenticated && privyProfile(privyUser).name) || user?.firstName || 'Mira'

  return (
    <div className={shared.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.greeting}>Hello, {greetName}</h1>

        <BalanceCard className={styles.cta} balance={`N${fmtNaira(balance)}.00`} onSend={goToSend} />

        <button className={styles.walletStrip} onClick={() => navigate('/wallet')}>
          <span className={styles.walletIcon}>
            <WalletIcon size={18} />
          </span>
          <span className={styles.walletText}>
            <span className={styles.walletLabel}>Web3 Wallet</span>
            <span className={styles.walletValue}>{fmtUsdc(walletBalance)} {asset}</span>
          </span>
          <ChevronRight size={18} color="var(--color-text-subtle)" />
        </button>

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
