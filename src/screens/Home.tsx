import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { BalanceCard } from '../components/BalanceCard'
import { Button } from '../components/Button'
import { TransactionItem } from '../components/TransactionItem'
import { AVAILABLE_BALANCE, RECENT_TRANSACTIONS } from '../data/transfer'

export default function Home() {
  const navigate = useNavigate()
  const goToSend = () => navigate('/send')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Hello, Mira</h1>

        <BalanceCard className="mt-6" balance={AVAILABLE_BALANCE} onSend={goToSend} />

        <Button variant="primary" fullWidth className="mt-6" onClick={goToSend}>
          Send Money
        </Button>

        <h2 className="mt-8 text-xl font-extrabold text-gray-900">Recent Transaction</h2>
        <div className="mt-4 space-y-4 pb-6">
          {RECENT_TRANSACTIONS.map((tx) => (
            <TransactionItem
              key={tx.id}
              name={tx.name}
              date={tx.date}
              amount={tx.amount}
              status={tx.status}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
