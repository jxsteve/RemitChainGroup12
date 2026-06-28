import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Copy,
  Check,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { useWallet, type WalletTx } from '../lib/walletStore'
import { useWalletIdentity } from '../lib/useWalletIdentity'
import { fmtUsdc, shortAddress } from '../lib/wallet'
import styles from './Wallet.module.css'

const TYPE_LABEL: Record<WalletTx['type'], string> = {
  deposit: 'Deposit',
  withdraw: 'Withdrawal',
  send: 'Sent',
  receive: 'Received',
}

export default function Wallet() {
  const navigate = useNavigate()
  const { balance, asset, activity } = useWallet()
  const { address, network } = useWalletIdentity()
  const [hidden, setHidden] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — no-op in the prototype */
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.title}>Wallet</h1>

        {/* Stablecoin balance card */}
        <div className={styles.card}>
          <div className={styles.glow} />
          <div className={styles.inner}>
            <div className={styles.cardTop}>
              <span className={styles.network}>{network} · {asset}</span>
              <button
                type="button"
                className={styles.eye}
                onClick={() => setHidden((v) => !v)}
                aria-label={hidden ? 'Show balance' : 'Hide balance'}
              >
                {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className={styles.balanceLabel}>Wallet Balance</p>
            <p className={styles.balance}>
              {hidden ? '••••••' : `${fmtUsdc(balance)}`} <span className={styles.asset}>{asset}</span>
            </p>

            <button type="button" className={styles.address} onClick={copyAddress}>
              <span>{address ? shortAddress(address) : '—'}</span>
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* Primary actions */}
        <div className={styles.actions}>
          <button className={styles.action} onClick={() => navigate('/wallet/receive')}>
            <span className={styles.actionIcon}><ArrowDownToLine size={20} /></span>
            Deposit
          </button>
          <button className={styles.action} onClick={() => navigate('/wallet/withdraw')}>
            <span className={styles.actionIcon}><ArrowUpFromLine size={20} /></span>
            Withdraw
          </button>
          <button className={styles.action} onClick={() => navigate('/send')}>
            <span className={styles.actionIcon}><Send size={18} style={{ transform: 'rotate(-12deg)' }} /></span>
            Send
          </button>
        </div>

        {/* How it works */}
        <div className={styles.explainer}>
          <p className={styles.explainerTitle}>How RemitChain works</p>
          <p className={styles.explainerBody}>
            Your money is held as {asset}, a stablecoin pegged 1:1 to the US dollar. When you
            send, it moves instantly on-chain and your recipient cashes out in their local
            currency — no banks, no borders.
          </p>
        </div>

        {/* On-chain activity */}
        <h2 className={styles.sectionTitle}>On-chain activity</h2>
        <div className={styles.list}>
          {activity.length === 0 && <p className={styles.empty}>No activity yet.</p>}
          {activity.map((tx) => {
            const incoming = tx.amount >= 0
            return (
              <div key={tx.id} className={styles.txRow}>
                <span className={styles.txIcon} data-in={incoming}>
                  {incoming ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </span>
                <div className={styles.txMeta}>
                  <p className={styles.txLabel}>{TYPE_LABEL[tx.type]} · {tx.label}</p>
                  <p className={styles.txSub}>{tx.date} · {tx.time}</p>
                </div>
                <div className={styles.txAmountWrap}>
                  <span className={styles.txAmount} data-in={incoming}>
                    {incoming ? '+' : '−'}{fmtUsdc(Math.abs(tx.amount))}
                  </span>
                  <span className={styles.txStatus} data-status={tx.status}>{tx.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
