import { useNavigate } from 'react-router-dom'
import { Check, FileText, ShieldCheck } from 'lucide-react'
import { Button } from '../components/Button'
import { Avatar } from '../components/Avatar'
import { StatusBadge } from '../components/StatusBadge'
import { useTransfer } from '../lib/transfer'
import { CONTACTS, fmt2 } from '../data/transfer'
import styles from './TransferSuccess.module.css'

/** Confirmation shown once the simulated transfer completes. */
export default function TransferSuccess() {
  const navigate = useNavigate()
  const { current, sendAmount, receiveAmount } = useTransfer()
  const r = current?.recipient ?? CONTACTS[1]

  const sent = current?.sentDisplay ?? `₦${fmt2(sendAmount)}`
  const gets = current?.receiveDisplay ?? `GHS ${fmt2(receiveAmount)}`
  const reference = current?.reference ?? 'RM000-000-000'
  const dateTime = current ? `${current.date.toUpperCase()} . ${current.time}` : '—'

  return (
    <div className={styles.screen}>
      <div className={styles.body}>
        <div className={styles.badge}>
          <Check size={46} strokeWidth={3} />
        </div>

        <h1 className={styles.title}>Transfer Successful</h1>
        <p className={styles.subtitle}>Your money has been sent securely</p>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>You sent</span>
            <span className={styles.summaryValue}>{sent}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Recipient gets</span>
            <span className={styles.summaryValue}>{gets}</span>
          </div>
        </div>

        <p className={styles.toLabel}>To</p>
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

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Transation ID</span>
            <span className={styles.detailValue}>
              {reference} <FileText size={15} className={styles.fileIcon} />
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Date &amp; Time</span>
            <span className={styles.detailValue}>{dateTime}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Status</span>
            <StatusBadge status="completed" />
          </div>
        </div>

        <p className={styles.secure}>
          <ShieldCheck size={16} color="var(--color-accent)" />
          your transfer is protected by Bank level security and blockchain technology
        </p>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={() => navigate('/track')}>
          Track Transfer
        </Button>
        <Button fullWidth variant="outline" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}
