import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, CreditCard } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import { Button } from '../components/Button'
import { useWallet } from '../lib/walletStore'
import { useWalletIdentity } from '../lib/useWalletIdentity'
import { shortAddress } from '../lib/wallet'
import shared from './shared.module.css'
import styles from './ReceiveFunds.module.css'

/** Deterministic faux-QR: a 21×21 grid seeded from the address characters. */
function FauxQR({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    const size = 21
    const out: boolean[] = []
    for (let i = 0; i < size * size; i++) {
      const c = seed.charCodeAt(i % seed.length)
      out.push(((c >> (i % 7)) ^ (i * 7)) % 3 === 0)
    }
    return out
  }, [seed])

  return (
    <div className={styles.qr} aria-hidden>
      {cells.map((on, i) => (
        <span key={i} data-on={on} />
      ))}
    </div>
  )
}

export default function ReceiveFunds() {
  const navigate = useNavigate()
  const { asset, deposit } = useWallet()
  const { address, network } = useWalletIdentity()
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState('')

  const copyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked */
    }
  }

  const topUp = () => {
    const value = Number(amount)
    if (!value || value <= 0) return
    deposit(value, 'Card top-up')
    navigate('/confirmation', {
      replace: true,
      state: {
        title: 'Wallet funded',
        message: `${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${asset} has been added to your wallet.`,
        ctaLabel: 'View wallet',
        to: '/wallet',
      },
    })
  }

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Add money" subtitle="Fund your wallet" onBack={() => navigate('/wallet')} />

      <div className={styles.scroll}>
        {/* Receive on-chain */}
        <div className={styles.qrCard}>
          <FauxQR seed={address ?? 'remitchain'} />
          <p className={styles.qrNote}>Scan to receive {asset} on {network}</p>
        </div>

        <div className={styles.addressBox}>
          <div>
            <p className={styles.addressLabel}>Your wallet address</p>
            <p className={styles.addressValue}>{address ? shortAddress(address, 10, 8) : '—'}</p>
          </div>
          <button type="button" className={styles.copy} onClick={copyAddress}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className={styles.warn}>
          Only send {asset} on the {network} network to this address. Sending
          other assets or networks may result in lost funds.
        </p>

        <div className={styles.divider}><span>or top up instantly</span></div>

        {/* Fiat on-ramp (mock) */}
        <label className={styles.fieldLabel} htmlFor="topup">Amount ({asset})</label>
        <div className={styles.amountField}>
          <span className={styles.amountPrefix}>$</span>
          <input
            id="topup"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            className={styles.amountInput}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button fullWidth leadingIcon={<CreditCard size={18} />} onClick={topUp} disabled={!Number(amount)}>
          Top up with card
        </Button>
      </div>
    </div>
  )
}
