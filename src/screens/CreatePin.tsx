import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { PinPad } from '../components/PinPad'
import shared from './shared.module.css'
import styles from './Verify.module.css'

export default function CreatePin() {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')

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
            <PinPad value={pin} onChange={setPin} onComplete={() => navigate('/home')} />
          </div>
        </div>
      </div>
    </div>
  )
}
