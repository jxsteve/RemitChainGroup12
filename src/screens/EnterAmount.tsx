import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { AVAILABLE_BALANCE } from '../data/transfer'
import styles from './EnterAmount.module.css'
import shared from './shared.module.css'

const RATE = 0.0096 // 1 NGN -> GHS

export default function EnterAmount() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('100000')

  const numeric = Number(amount.replace(/,/g, '')) || 0
  const formatted = numeric ? numeric.toLocaleString('en-US') : ''
  const receives = (numeric * RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Enter Amount" />

      <div className={styles.scroll}>
        <label className={styles.label}>You send</label>
        <div className={styles.amountBox}>
          <span className={styles.currency}>N</span>
          <input
            className={styles.amountInput}
            inputMode="numeric"
            value={formatted}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
            aria-label="Amount to send"
            style={{ marginLeft: 2 }}
          />
        </div>
        <p className={styles.balance}>
          Available Balance: <span className={styles.balanceValue}>{AVAILABLE_BALANCE}</span>
        </p>

        <div className={`${styles.rateBox} ${styles.gap}`}>
          <p className={styles.rateTitle}>Exchange Rate</p>
          <p className={styles.rateValue}>1 NGN + {RATE} GHS</p>
        </div>

        <label className={`${styles.label} ${styles.gap}`} style={{ display: 'block' }}>
          Recipient Receives
        </label>
        <div className={styles.receiveBox}>GHS {receives}</div>
      </div>

      <div className={styles.footer}>
        <Button fullWidth disabled={!numeric} onClick={() => navigate('/review')}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
