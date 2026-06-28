import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import shared from './shared.module.css'
import styles from './Login.module.css'

/**
 * Login entry point. Real auth is handled by Privy's hosted modal (email code /
 * SMS / wallet) — tapping Continue opens it. New users are routed to set their
 * app PIN; returning users go straight home. With embedded wallets enabled, the
 * `onComplete` callback fires only after the wallet has been provisioned.
 */
export default function Login() {
  const navigate = useNavigate()
  const { ready } = usePrivy()
  const { login } = useLogin({
    onComplete: ({ isNewUser }) =>
      navigate(isNewUser ? '/create-pin' : '/home', { replace: true }),
  })

  return (
    <div className={shared.screen}>
      <div className={shared.scroll}>
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.back}
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} strokeWidth={2.25} />
          </button>
          <Logo size={22} />
        </div>

        <h1 className={styles.welcome}>Welcome Back!</h1>

        <div className={shared.body}>
          <h2 className={styles.heading}>Login</h2>
          <p className={styles.subtitle}>
            Continue with your email, phone number or wallet — we'll send a one-time code to verify
            it's you.
          </p>

          <Button
            fullWidth
            className={styles.submit}
            disabled={!ready}
            onClick={() => login()}
          >
            Continue
          </Button>

          <p className={styles.secure}>
            <ShieldCheck size={16} color="var(--color-accent)" />
            Your funds and data are protected with Bank-level security
          </p>
        </div>
      </div>

      <div className={shared.bottom}>
        <p className={shared.footnote}>
          Dont Have an Account?
          <button className={shared.linkBtn} onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
