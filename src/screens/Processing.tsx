import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Navigation, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { useTransfer } from '../lib/transfer'
import { fmt2 } from '../data/transfer'
import styles from './Processing.module.css'

export default function Processing() {
  const navigate = useNavigate()
  const { current, sendAmount, receiveAmount, completeTransfer } = useTransfer()

  // Settle the transfer, then move to the success confirmation.
  useEffect(() => {
    const t = setTimeout(() => {
      completeTransfer()
      navigate('/success')
    }, 4000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reference = current?.reference ?? 'RM000-000-000'
  const sent = current?.sentDisplay ?? `₦${fmt2(sendAmount)}`
  const gets = current?.receiveDisplay ?? `GHS ${fmt2(receiveAmount)}`

  return (
    <div className={styles.screen}>
      <button type="button" className={styles.back} aria-label="Go back" onClick={() => navigate(-1)}>
        <ArrowLeft size={24} strokeWidth={2.25} />
      </button>

      <div className={styles.body}>
        <div className={styles.ringWrap}>
          <span className={styles.ring} />
          <span className={styles.pulse} />
          <Navigation size={34} className={styles.icon} style={{ transform: 'rotate(-12deg)' }} />
        </div>

        <h1 className={styles.title}>Processing Transfer</h1>
        <p className={styles.subtitle}>
          Please wait while we securely
          <br />
          process your transaction
        </p>

        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.label}>Transation ID</span>
            <span className={styles.value}>
              {reference} <FileText size={15} className={styles.fileIcon} />
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Your sent</span>
            <span className={styles.value}>{sent}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Recipient gets</span>
            <span className={styles.value}>{gets}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <StatusBadge status="processing" />
          </div>
        </div>
      </div>

      <div className={styles.note}>
        <ShieldCheck size={18} className={styles.noteIcon} />
        Do not close this screen or press the back button while we process your transfer
      </div>
    </div>
  )
}
