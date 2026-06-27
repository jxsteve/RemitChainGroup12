import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { OtpInput } from '../components/OtpInput'
import { Button } from '../components/Button'
import { useCountdown } from '../lib/useCountdown'
import shared from './shared.module.css'
import styles from './Verify.module.css'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const { seconds, restart } = useCountdown(25)

  return (
    <div className={shared.screen}>
      <div className={styles.head}>
        <button type="button" className={styles.back} aria-label="Go back" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
      </div>

      <div className={shared.scroll}>
        <div className={styles.center} style={{ marginTop: 32 }}>
          <img src="/img/unsplash__rqDHdrKIJs.png" alt="Send Icon"  className={styles.send}/>
         
              <br />
              <br />
          <h1 className={styles.title}>Verify Your Email</h1>
          <p className={styles.subtitle}>we sent a 6-digit code to your email...........</p>
              <br />
          <div className={styles.otp}>
            <OtpInput value={code} onChange={setCode} onComplete={() => navigate('/verify-otp')} />
          </div>
              <br />
          <p className={styles.resend}>
            Didnt get the code?{' '}
            <button className={styles.resendLink} disabled={seconds > 0} onClick={restart}>
              {seconds > 0 ? `Resend (${seconds}s)` : 'Resend'}
            </button>
          </p>

          <div className={styles.continueWrap}>
            <Button fullWidth disabled={code.length < 6} onClick={() => navigate('/verify-otp')}>
              Continue
            </Button>
          </div>

          <p className={styles.orUse}>
            Or Use
            <button className={styles.orUsePill} onClick={() => navigate('/verify-otp')}>
              Phone Number
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
