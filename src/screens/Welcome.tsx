import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import shared from './shared.module.css'
import styles from './Welcome.module.css'

export default function Welcome() {
  const navigate = useNavigate()
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className={shared.screen}>
        <div className={styles.hero}>
          <div className={styles.logo}>
            <Logo size={24} />
          </div>

          {imgOk ? (
            <img
              className={styles.heroImg}
              src="/img/unsplash_A60Ti1aJ8hg.png"
              alt="Secure cross-border payments"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className={styles.fallback}>
              <ShieldCheck size={88} strokeWidth={1.5} />
            </div>
          )}
        </div>

      <div className={shared.bottom}>
        <div className={shared.body} style={{ marginTop: 28 }}>
          <h1 className={styles.title}>
            Secure. Fast.
            <br />
            Borderless
          </h1>
          <p className={styles.subtitle}>Send money across Africa with Confidence</p>
        </div>
        
        <Button fullWidth onClick={() => navigate('/signup')}>
          Create Account
        </Button>
        <p className={shared.footnote}>
          Already have an account?
         
        </p>
      </div>
       <button className={styles.linkBtn} onClick={() => navigate('/login')}>
            Log in
          </button>
    </div>
  )
}
