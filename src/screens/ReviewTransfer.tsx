import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'

interface Row {
  label: string
  value: string
  small?: boolean
}

const ROWS: Row[] = [
  { label: 'You send', value: 'N100,000.00' },
  { label: 'Transfer fee', value: 'N1,500.00' },
  { label: 'Exchange Rate', value: '1 NGN = 0.0095 GHS', small: true },
  { label: 'Recipient Receives', value: '' },
  { label: 'Recipient', value: 'Ayo' },
  { label: 'Country', value: 'Ghana' },
  { label: 'Estimated Arrival', value: 'Less than 2 minutes', small: true },
]

export default function ReviewTransfer() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title="Review Transfer" />

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        <section className="rounded-2xl bg-gray-200/70 px-5 py-2 ring-1 ring-primary/30">
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={i === ROWS.length - 1 ? '' : 'border-b border-primary/40'}
            >
              <div className="flex items-center justify-between py-4">
                <span
                  className={
                    row.small
                      ? 'text-xs font-medium text-gray-600'
                      : 'text-base font-semibold text-gray-900'
                  }
                >
                  {row.label}
                </span>
                <span
                  className={
                    row.small
                      ? 'text-xs font-medium text-gray-600'
                      : 'text-base font-bold text-gray-900'
                  }
                >
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </section>

        <Button variant="primary" fullWidth className="mt-8 mb-6" onClick={() => navigate('/processing')}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
