import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { PinPad } from '../components/PinPad'
import { useAuth } from '../lib/auth'
import shared from './shared.module.css'
import styles from './Verify.module.css'

export default function CreatePin() {
  const navigate = useNavigate()
  const { completeSignup } = useAuth()
  const [pin, setPin] = useState('')

  const handleComplete = (fullPin: string) => {
    // Use the value PinPad reports on completion — the `pin` state hasn't
    // committed the final digit yet when this fires synchronously.
    // Register + sign in using the PIN as the password. If the user reached
    // this screen without an in-progress signup, just continue to the app.
    try {
      completeSignup(fullPin)
    } catch {
      /* no pending signup — nothing to finalise */
    }
    navigate('/confirmation', {
      replace: true,
      state: {
        title: 'Passcode Created',
        message: 'Your 6-digit PIN has been set successfully. Keep it safe — you will use it to log in and authorise transfers.',
        ctaLabel: 'Continue',
        to: '/home',
      },
    })
  }

  return (
    <div className={shared.screen}>
      <div className={styles.head}>
        <button type="button" className={styles.back} aria-label="Go back" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
      </div>

      <div className={shared.scroll}>
        <div className={styles.center} style={{ marginTop: 8 }}>
          <div className={shared.iconTile} style={{ background: 'linear-gradient(150deg,#c98a4a,#7a4a1e)' }}>
            <LockKeyhole size={40} />
          </div>

          <h1 className={styles.title}>Create 6-digit Pin</h1>
          <p className={styles.subtitle}>This Pin will protect your account</p>

          <div style={{ marginTop: 40, padding: '0 24px' }}>
            <PinPad value={pin} onChange={setPin} onComplete={handleComplete} />
          </div>
        </div>
      </div>
    </div>
  )
}
