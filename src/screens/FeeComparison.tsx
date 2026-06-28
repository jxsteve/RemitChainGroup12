import { useNavigate } from 'react-router-dom'
import { Info } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import { Button } from '../components/Button'
import { useTransfer } from '../lib/transfer'
import { fmtNaira } from '../data/transfer'
import shared from './shared.module.css'
import styles from './FeeComparison.module.css'

interface Provider {
  name: string
  fee: number
  speed: string
  fast: boolean
  best?: boolean
}

/**
 * §5.4 Fee Comparison — shows RemitChain's fee/speed against traditional
 * remittance services so users can see the lower cost and faster settlement.
 * Traditional figures are representative estimates (fiat conversion is mocked
 * per the PRD); RemitChain's fee comes from the live transfer context.
 */
export default function FeeComparison() {
  const navigate = useNavigate()
  const { sendAmount, fee } = useTransfer()
  const amount = sendAmount || 100_000

  const providers: Provider[] = [
    { name: 'RemitChain', fee, speed: 'Under 2 minutes', fast: true, best: true },
    { name: 'Bank Transfer', fee: Math.max(5_000, Math.round(amount * 0.035)), speed: '3–5 business days', fast: false },
    { name: 'Western Union', fee: 4_500, speed: 'Up to 24 hours', fast: false },
    { name: 'MoneyGram', fee: 4_000, speed: 'A few hours', fast: false },
  ]

  const maxFee = Math.max(...providers.map((p) => p.fee))
  const savings = maxFee - fee

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Fee Comparison" />

      <div className={styles.scroll}>
        <p className={styles.intro}>
          Sending <span className={styles.amount}>₦{fmtNaira(amount)}</span> — here's how RemitChain compares to
          traditional remittance services.
        </p>

        <div className={styles.savings}>
          <p className={styles.savingsLabel}>You save up to</p>
          <p className={styles.savingsValue}>₦{fmtNaira(savings)}</p>
        </div>

        <div className={styles.list}>
          {providers.map((p) => (
            <div key={p.name} className={`${styles.card} ${p.best ? styles.best : ''}`}>
              <div className={styles.cardTop}>
                <span className={styles.provider}>{p.name}</span>
                {p.best && <span className={styles.tag}>BEST VALUE</span>}
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Transfer fee</span>
                <span className={`${styles.value} ${p.best ? styles.feeBest : ''}`}>₦{fmtNaira(p.fee)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Arrival time</span>
                <span className={`${styles.value} ${p.fast ? styles.fast : styles.slow}`}>{p.speed}</span>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.disclaimer}>
          <Info size={15} className={styles.disclaimerIcon} />
          Comparison figures for traditional services are estimates for illustration. Fiat conversion is simulated for
          this MVP and not a financial quote.
        </p>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={() => navigate('/review')}>
          Continue transfer
        </Button>
      </div>
    </div>
  )
}
