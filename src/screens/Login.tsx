import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import shared from './shared.module.css'
import styles from './Login.module.css'

/**
 * Login entry point. Real auth is handled by Privy's hosted modal (email code /
 * SMS / wallet) — tapping Login opens it, prefilled with the email/phone the
 * user typed. New users are routed to set their app PIN; returning users go home.
 */
export default function Login() {
  const navigate = useNavigate()
  const { ready } = usePrivy()
  const { login } = useLogin({
    onComplete: ({ isNewUser }) =>
      navigate(isNewUser ? '/create-pin' : '/home', { replace: true }),
  })

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleLogin = () => {
    const id = identifier.trim()
    if (/\S+@\S+\.\S+/.test(id)) {
      login({ prefill: { type: 'email', value: id } })
    } else if (id.replace(/\D/g, '').length >= 7) {
      login({ prefill: { type: 'phone', value: id } })
    } else {
      login()
    }
  }

  return (
    <div className={shared.screen}>
      <div className={shared.scroll}>
        <div className={styles.topbar}>
          <Logo size={24} />
        </div>

        <h1 className={styles.welcome}>Welcome Back!</h1>

        <div className={shared.body}>
          <h2 className={styles.heading}>Login</h2>
          <p className={styles.subtitle}>Let's get you started</p>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault()
              if (ready) handleLogin()
            }}
          >
            <Input
              label="Email address/ Phone Number"
              placeholder="Input your email address/phone number"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leading={<LockKeyhole size={18} />}
              trailing={
                <button
                  type="button"
                  className={styles.eye}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              }
            />

            <button type="button" className={styles.forgot} onClick={() => navigate('/login')}>
              Forgot password
            </button>

            <Button type="submit" fullWidth className={styles.submit} disabled={!ready}>
              Login
            </Button>
          </form>

          <p className={styles.secure}>
            <ShieldCheck size={16} color="var(--color-accent)" />
            Your funds and data are protected with Bank-level security
          </p>
        </div>
      </div>

      <div className={shared.bottom}>
        <p className={styles.footnote}>
          Don't have an account?{' '}
          <button type="button" className={styles.createLink} onClick={() => navigate('/signup')}>
            Create account
          </button>
        </p>
      </div>
    </div>
  )
}
