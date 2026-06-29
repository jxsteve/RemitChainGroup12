import { useNavigate } from 'react-router-dom'
import { Send, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { BalanceCard } from '../components/BalanceCard'
import { useWallet, type WalletTx } from '../lib/walletStore'
import { useWalletIdentity } from '../lib/useWalletIdentity'
import { fmtUsdc } from '../lib/wallet'
import { fmtNaira, usdcToNgn } from '../data/transfer'
import styles from './Wallet.module.css'

const TYPE_LABEL: Record<WalletTx['type'], string> = {
  deposit: 'Deposit',
  withdraw: 'Withdrawal',
  send: 'Sent',
  receive: 'Received',
}

export default function Wallet() {
  const navigate = useNavigate()
  const { balance, activity } = useWallet()
  const { address } = useWalletIdentity()

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <h1 className={styles.title}>Wallet</h1>

        {/* Primary balance card */}
        <BalanceCard
          className={styles.balanceCard}
          balance={`N${fmtNaira(usdcToNgn(balance))}.00`}
          address={address ?? undefined}
          onSend={() => navigate('/send')}
        />

        {/* Primary action */}
        <div className={styles.actions}>
          <button className={styles.action} onClick={() => navigate('/send')}>
            <span className={styles.actionIcon}><Send size={18} style={{ transform: 'rotate(-12deg)' }} /></span>
            Send
          </button>
        </div>

        {/* How it works */}
        <div className={styles.explainer}>
          <p className={styles.explainerTitle}>How RemitChain works</p>
          <p className={styles.explainerBody}>
            Send money across Africa in seconds — secure, low-cost transfers with no banks in between.
          </p>
        </div>

        {/* Recent on-chain activity */}
        <h2 className={styles.sectionTitle}>Recent on-chain activity</h2>
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
