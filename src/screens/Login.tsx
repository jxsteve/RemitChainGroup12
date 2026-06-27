import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import shared from './shared.module.css'
import styles from './login.module.css'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const canSubmit =
    /\S+@\S+\.\S+/.test(email) && password.trim().length >= 6

  return (
    <div className={shared.screen}>
      <div className={shared.scroll}>
        <div className={styles.head}>
          <button
            type="button"
            className={styles.back}
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} strokeWidth={2.25} />
          </button>

          <h1 className={styles.title}>Welcome Back!</h1>

        </div>

        <div className={shared.body}>
          <div className={styles.form}>
            <div>
              <h2>Login</h2>
              <p className="login-subtitle">Let's get you started</p>
            </div>
            <Input
              label="Email Address/Phone Number"
              type="email"
              placeholder="Enter email address/Phone Number "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className={shared.linkBtn}
              style={{ alignSelf: 'flex-end', marginTop: '-8px' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      <div className={shared.bottom}>
        <Button
          fullWidth
          disabled={!canSubmit}
          onClick={() => navigate('/home')}
        >
          Log In
        </Button>

        <p className={shared.footnote}>
          Don't have an account?{' '}
          <button
            className={shared.linkBtn}
            onClick={() => navigate('/create-account')}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}