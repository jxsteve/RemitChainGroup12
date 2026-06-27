import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '../components/Button'
import styles from './Confirmation.module.css'

/** Passed via `navigate('/confirmation', { state })` to tailor the message. */
export interface ConfirmationState {
  title?: string
  message?: string
  ctaLabel?: string
  /** Where the CTA goes. */
  to?: string
}

/**
 * Generic success/confirmation page. Reused after any credential is set —
 * a passcode (PIN) today, a password reset later — by passing route state.
 */
export default function Confirmation() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    title = 'Passcode Created',
    message = 'Your 6-digit PIN has been set successfully. Keep it safe — you will use it to log in and authorise transfers.',
    ctaLabel = 'Continue',
    to = '/home',
  } = (state ?? {}) as ConfirmationState

  return (
    <div className={styles.screen}>
      <div className={styles.body}>
        <div className={styles.badge}>
          <Check size={46} strokeWidth={3} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{message}</p>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={() => navigate(to, { replace: true })}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
