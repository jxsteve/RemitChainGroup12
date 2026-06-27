import { useNavigate } from 'react-router-dom'
import { ChevronDown, Info, ShieldCheck } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { Avatar } from '../components/Avatar'
import { useTransfer } from '../lib/transfer'
import { CONTACTS, RATE, fmt2, fmtNaira } from '../data/transfer'
import shared from './shared.module.css'
import styles from './ReviewTransfer.module.css'

export default function ReviewTransfer() {
  const navigate = useNavigate()
  const { recipient, sendAmount, receiveAmount, fee, total, balance, commitTransfer } = useTransfer()
  const r = recipient ?? CONTACTS[1]

  const confirm = () => {
    commitTransfer()
    navigate('/processing')
  }

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Review Transfer" />

      <div className={styles.scroll}>
        <div className={styles.warning}>
          <ShieldCheck size={18} className={styles.warnIcon} />
          please review the details carefully. Once you confirm, the transfer cannot be cancelled
        </div>

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

        <p className={styles.eyebrow}>YOU SEND</p>
        <div className={styles.amountCard}>
          <div className={styles.amountRow}>
            <span className={styles.curr}>
              <span style={{ fontSize: 20 }}>🇳🇬</span> NGN <ChevronDown size={16} />
            </span>
            <span className={styles.amountValue}>{fmtNaira(sendAmount)}.00</span>
          </div>
          <div className={styles.amountFoot}>
            <span>Naira</span>
            <span className={styles.balance}>Available Balance: ₦{fmtNaira(balance)}</span>
          </div>
        </div>

        <p className={styles.eyebrow}>RECIPIENT GETS</p>
        <div className={styles.amountCard}>
          <div className={styles.amountRow}>
            <span className={styles.curr}>
              <span style={{ fontSize: 20 }}>🇬🇭</span> GHS <ChevronDown size={16} />
            </span>
            <span className={styles.amountValue}>{fmt2(receiveAmount)}</span>
          </div>
          <div className={styles.amountFoot}>
            <span>Cedi</span>
          </div>
        </div>

        <p className={styles.detailsTitle}>Transfer Details</p>
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>
              Exchange Rate <Info size={14} className={styles.info} />
            </span>
            <span className={styles.detailValue}>1 NGN = {RATE.toFixed(5)} GHS</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Transfer fee</span>
            <span className={styles.detailValue}>₦{fmtNaira(fee)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabelStrong}>Total</span>
            <span className={styles.detailValueStrong}>₦{fmtNaira(total)}</span>
          </div>
        </div>

        <p className={styles.secure}>
          <ShieldCheck size={16} color="var(--color-accent)" />
          your transfer is protected by Bank level security and blockchain technology
        </p>

        <Button fullWidth className={styles.confirm} onClick={confirm}>
          Confirm
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
