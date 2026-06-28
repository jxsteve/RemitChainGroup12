import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import shared from './shared.module.css'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  // Real authentication is handled by Privy (email code / SMS / wallet).
  const { ready, authenticated, login } = usePrivy()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Once Privy reports an authenticated session, enter the app.
  useEffect(() => {
    if (ready && authenticated) navigate('/home', { replace: true })
  }, [ready, authenticated, navigate])

  const handleLogin = () => login()
  const canSubmit = ready

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
          <p className={styles.subtitle}>Let's get you started</p>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault()
              if (canSubmit) handleLogin()
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
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="button" className={styles.forgot} onClick={handleLogin}>
              Forgot password
            </button>

            <Button type="submit" fullWidth className={styles.submit} disabled={!canSubmit}>
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
