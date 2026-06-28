import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Landmark, Smartphone } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import { Button } from '../components/Button'
import { useWallet } from '../lib/walletStore'
import { fmtUsdc } from '../lib/wallet'
import shared from './shared.module.css'
import styles from './Withdraw.module.css'

type Method = 'bank' | 'momo'

export default function Withdraw() {
  const navigate = useNavigate()
  const { balance, asset, withdraw } = useWallet()
  const [method, setMethod] = useState<Method>('bank')
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')

  const value = Number(amount)
  const tooMuch = value > balance
  const valid = value > 0 && !tooMuch && account.trim().length >= 6

  const cashOut = () => {
    if (!valid) return
    const dest = method === 'bank' ? `Bank · ${account}` : `Mobile money · ${account}`
    withdraw(value, dest)
    navigate('/confirmation', {
      replace: true,
      state: {
        title: 'Withdrawal started',
        message: `${fmtUsdc(value)} ${asset} is being converted and sent to your ${
          method === 'bank' ? 'bank account' : 'mobile money'
        }. It usually arrives within minutes.`,
        ctaLabel: 'Back to wallet',
        to: '/wallet',
      },
    })
  }

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Withdraw" subtitle="Cash out to local currency" onBack={() => navigate('/wallet')} />

      <div className={styles.scroll}>
        <div className={styles.balanceLine}>
          Available: <strong>{fmtUsdc(balance)} {asset}</strong>
        </div>

        {/* Destination method */}
        <div className={styles.methods}>
          <button
            type="button"
            className={styles.method}
            data-active={method === 'bank'}
            onClick={() => setMethod('bank')}
          >
            <Landmark size={20} />
            Bank account
          </button>
          <button
            type="button"
            className={styles.method}
            data-active={method === 'momo'}
            onClick={() => setMethod('momo')}
          >
            <Smartphone size={20} />
            Mobile money
          </button>
        </div>

        <label className={styles.fieldLabel} htmlFor="amt">Amount ({asset})</label>
        <div className={styles.amountField} data-error={tooMuch}>
          <span className={styles.amountPrefix}>$</span>
          <input
            id="amt"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            className={styles.amountInput}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="button" className={styles.max} onClick={() => setAmount(String(balance))}>
            MAX
          </button>
        </div>
        {tooMuch && <p className={styles.error}>Amount exceeds your wallet balance.</p>}

        <label className={styles.fieldLabel} htmlFor="acct">
          {method === 'bank' ? 'Account number' : 'Mobile money number'}
        </label>
        <input
          id="acct"
          className={styles.textInput}
          inputMode="numeric"
          placeholder={method === 'bank' ? '0123456789' : '+233 ...'}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />

        <p className={styles.note}>
          Funds are converted from {asset} to local currency at the live rate. No hidden charges.
        </p>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={cashOut} disabled={!valid}>
          Withdraw {value > 0 && !tooMuch ? `${fmtUsdc(value)} ${asset}` : ''}
        </Button>
      </div>
    </div>
  )
}
