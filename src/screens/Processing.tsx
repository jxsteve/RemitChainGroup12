import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, FileText, Navigation, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/Button'
import { useTransfer } from '../lib/transfer'
import { useRemitChain } from '../lib/remitchain'
import { fmt2, ngnToUsdc } from '../data/transfer'
import styles from './Processing.module.css'

export default function Processing() {
  const navigate = useNavigate()
  const { current, sendAmount, receiveAmount, completeTransfer, failTransfer } = useTransfer()
  const { ready, configured, sendMoney } = useRemitChain()
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    // When the contract is configured, wait for the embedded wallet to be ready
    // before deciding which path to take.
    if (configured && !ready) return
    started.current = true
    let cancelled = false

    const to = current?.recipient.address as `0x${string}` | undefined

    async function run() {
      // Real on-chain settlement: approve USDC + sendMoney on the contract.
      if (ready && to && current) {
        try {
          const { hash } = await sendMoney({
            to,
            amountUsdc: ngnToUsdc(sendAmount),
            reference: current.reference,
          })
          if (cancelled) return
          completeTransfer(hash)
          navigate('/success')
        } catch (e) {
          if (cancelled) return
          failTransfer()
          setError(e instanceof Error ? e.message : 'The on-chain transfer failed.')
        }
        return
      }
      // Mock settlement (no contract configured / no wallet): simulate then finish.
      await new Promise((r) => setTimeout(r, 4000))
      if (cancelled) return
      completeTransfer()
      navigate('/success')
    }

    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, configured])

  const reference = current?.reference ?? 'RM000-000-000'
  const sent = current?.sentDisplay ?? `₦${fmt2(sendAmount)}`
  const gets = current?.receiveDisplay ?? `GHS ${fmt2(receiveAmount)}`

  if (error) {
    return (
      <div className={styles.screen}>
        <button type="button" className={styles.back} aria-label="Go back" onClick={() => navigate('/review')}>
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <div className={styles.body}>
          <div className={styles.ringWrap}>
            <span className={styles.ring} style={{ borderColor: 'rgba(239,68,68,0.4)' }} />
            <AlertTriangle size={34} className={styles.icon} style={{ color: '#ef4444' }} />
          </div>
          <h1 className={styles.title}>Transfer Failed</h1>
          <p className={styles.subtitle}>{error}</p>
          <div style={{ marginTop: 32, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button fullWidth onClick={() => navigate('/review')}>
              Try Again
            </Button>
            <Button fullWidth variant="outline" onClick={() => navigate('/home')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
