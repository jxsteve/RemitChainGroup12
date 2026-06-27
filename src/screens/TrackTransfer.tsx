import { Check, FileText, ShieldCheck } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Avatar } from '../components/Avatar'
import { StatusBadge } from '../components/StatusBadge'
import { useTransfer } from '../lib/transfer'
import { CONTACTS, fmt2, fmtNaira } from '../data/transfer'
import shared from './shared.module.css'
import styles from './TrackTransfer.module.css'

type StepState = 'done' | 'active' | 'pending'
interface Step {
  title: string
  description: string
  state: StepState
}

export default function TrackTransfer() {
  const { current, sendAmount, receiveAmount } = useTransfer()
  const r = current?.recipient ?? CONTACTS[1]
  const completed = current?.status === 'completed'

  const sent = current?.sentDisplay ?? `₦${fmtNaira(sendAmount)}.00`
  const gets = current?.receiveDisplay ?? `GHS ${fmt2(receiveAmount)}`
  const reference = current?.reference ?? 'RM000-000-000'

  const steps: Step[] = [
    { title: 'Transfer Initiated', description: 'Your transfer has been created', state: 'done' },
    {
      title: 'Payment Verified',
      description: 'Your payment has been verified by RemitChain.',
      state: 'done',
    },
    {
      title: 'Processing',
      description: 'We are sending your money securely across the network',
      state: completed ? 'done' : 'active',
    },
    {
      title: 'Completed',
      description: 'Your recipient will receive the money shortly',
      state: completed ? 'active' : 'pending',
    },
  ]

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Track Transfer" />

      <div className={styles.scroll}>
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
            <StatusBadge status={current?.status ?? 'processing'} />
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

        <ol className={styles.timeline}>
          {steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <div className={styles.markerCol}>
                <span className={`${styles.marker} ${styles[step.state]}`}>
                  {step.state === 'done' && <Check size={14} strokeWidth={3} />}
                </span>
                {i < steps.length - 1 && (
                  <span className={`${styles.connector} ${step.state === 'done' ? styles.connectorDone : ''}`} />
                )}
              </div>
              <div className={styles.stepBody}>
                <p className={`${styles.stepTitle} ${step.state === 'active' ? styles.stepTitleActive : ''}`}>
                  {step.title}
                </p>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.eta}>
          <ShieldCheck size={18} className={styles.etaIcon} />
          <div>
            <p className={styles.etaTitle}>Estimated Arrival</p>
            <p className={styles.etaSub}>Less than an hour.</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
