import { useNavigate } from 'react-router-dom'
import { ChevronDown, TrendingDown } from 'lucide-react'
import ScreenHeader, { CancelButton } from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { Avatar } from '../components/Avatar'
import { useTransfer } from '../lib/transfer'
import { CONTACTS, fmt2, fmtNaira } from '../data/transfer'
import shared from './shared.module.css'
import styles from './EnterAmount.module.css'

export default function EnterAmount() {
  const navigate = useNavigate()
  const { recipient, sendAmount, setSendAmount, receiveAmount, balance } = useTransfer()
  const r = recipient ?? CONTACTS[1]

  const formatted = sendAmount ? sendAmount.toLocaleString('en-US') : ''

  return (
    <div className={shared.screen}>
      <ScreenHeader
        title="Enter Amount"
        subtitle="how much do you want to send"
        action={<CancelButton onClick={() => navigate('/home')} />}
      />

      <div className={styles.scroll}>
        <p className={styles.eyebrow}>RECIPIENT</p>
        <div className={styles.recipient}>
          <Avatar name={r.name} size={44} />
          <div className={styles.recipientMeta}>
            <p className={styles.recipientName}>{r.name}</p>
            <p className={styles.recipientWallet}>{r.wallet}</p>
          </div>
          <div className={styles.recipientCountry}>
            <span style={{ fontSize: 20 }}>{r.country.flag}</span>
            <span>{r.country.name}</span>
          </div>
        </div>

        <div className={styles.sendCard}>
          <p className={styles.sendLabel}>You send</p>
          <div className={styles.sendRow}>
            <button type="button" className={styles.currencyBtn}>
              <span style={{ fontSize: 20 }}>🇳🇬</span>
              NGN
              <ChevronDown size={16} />
            </button>
            <input
              className={styles.amountInput}
              inputMode="numeric"
              value={formatted}
              onChange={(e) => setSendAmount(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
              aria-label="Amount to send"
            />
          </div>
          <div className={styles.sendFooter}>
            <span className={styles.balance}>Available balance: ₦{fmtNaira(balance)}</span>
            <button type="button" className={styles.max} onClick={() => setSendAmount(balance)}>
              MAX
            </button>
          </div>
        </div>

        <div className={styles.receiveCard}>
          <p className={styles.receiveLabel}>Recipient gets</p>
          <div className={styles.receiveRow}>
            <span className={styles.receiveAmount}>GH₵ {fmt2(receiveAmount)}</span>
            <span style={{ fontSize: 24 }}>{r.country.flag}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/compare')}
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--color-accent)',
            background: 'none',
          }}
        >
          <TrendingDown size={16} />
          Compare fees &amp; see your savings
        </button>
      </div>

      <div className={styles.footer}>
        <Button fullWidth disabled={!sendAmount || sendAmount > balance} onClick={() => navigate('/review')}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
