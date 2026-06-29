import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, TrendingDown } from 'lucide-react'
import ScreenHeader, { CancelButton } from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { Avatar } from '../components/Avatar'
import { useTransfer } from '../lib/transfer'
import { useWallet } from '../lib/walletStore'
import { CONTACTS, fmt2, fmtNaira, ngnToUsdc, usdcToNgn } from '../data/transfer'
import shared from './shared.module.css'
import styles from './EnterAmount.module.css'

type InputCurrency = 'NGN' | 'USDC'
const CURRENCIES: { code: InputCurrency; flag: string }[] = [
  { code: 'NGN', flag: '🇳🇬' },
  { code: 'USDC', flag: '💵' },
]

export default function EnterAmount() {
  const navigate = useNavigate()
  const { recipient, sendAmount, setSendAmount, receiveAmount, balance } = useTransfer()
  const { balance: walletUsdc } = useWallet()
  const r = recipient ?? CONTACTS[1]

  const [currency, setCurrency] = useState<InputCurrency>('NGN')
  const [menuOpen, setMenuOpen] = useState(false)

  // The store keeps the canonical amount in NGN; the input simply shows/edits it
  // in the currently selected currency.
  const toDisplay = (ngn: number, cur: InputCurrency) => (cur === 'NGN' ? ngn : ngnToUsdc(ngn))
  const toCanonical = (disp: number, cur: InputCurrency) =>
    cur === 'NGN' ? Math.round(disp) : Math.round(usdcToNgn(disp))

  const [text, setText] = useState(() => fmt2(toDisplay(sendAmount, 'NGN')))

  const onAmountChange = (raw: string) => {
    // digits + a single decimal point
    const cleaned = raw.replace(/[^\d.]/g, '').replace(/(\.\d*)\./g, '$1')
    setText(cleaned)
    setSendAmount(toCanonical(Number(cleaned) || 0, currency))
  }

  const pickCurrency = (cur: InputCurrency) => {
    setCurrency(cur)
    setMenuOpen(false)
    setText(fmt2(toDisplay(sendAmount, cur)))
  }

  const onMax = () => {
    setSendAmount(balance)
    setText(fmt2(toDisplay(balance, currency)))
  }

  const active = CURRENCIES.find((c) => c.code === currency)!

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
            <div className={styles.currencyWrap}>
              <button
                type="button"
                className={styles.currencyBtn}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span style={{ fontSize: 20 }}>{active.flag}</span>
                {active.code}
                <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className={styles.currencyMenu}>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className={`${styles.currencyOption} ${
                        c.code === currency ? styles.currencyOptionActive : ''
                      }`}
                      onClick={() => pickCurrency(c.code)}
                    >
                      <span style={{ fontSize: 18 }}>{c.flag}</span>
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              className={styles.amountInput}
              inputMode="decimal"
              value={text}
              onChange={(e) => onAmountChange(e.target.value)}
              onBlur={() => setText(fmt2(toDisplay(sendAmount, currency)))}
              aria-label="Amount to send"
            />
          </div>
          <div className={styles.sendFooter}>
            <span className={styles.balance}>
              {currency === 'NGN'
                ? `Available balance: ₦${fmtNaira(balance)}`
                : `Available balance: ${fmt2(walletUsdc)} USDC`}
            </span>
            <button type="button" className={styles.max} onClick={onMax}>
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
