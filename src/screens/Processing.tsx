import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from 'lucide-react'
import styles from './Processing.module.css'

export default function Processing() {
  const navigate = useNavigate()

  // Advance to the success confirmation once the simulated transfer completes.
  useEffect(() => {
    const t = setTimeout(() => navigate('/success'), 4000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className={styles.screen}>
      <p className={styles.topLabel}>Processing</p>

      <div className={styles.body}>
        <div className={styles.ringWrap}>
          <span className={styles.ring} />
          <span className={styles.pulse} />
          <span className={styles.disc}>
            <Navigation size={40} className={styles.icon} style={{ transform: 'rotate(-12deg)' }} />
          </span>
        </div>

        <h1 className={styles.title}>Sending Your Money...</h1>
        <p className={styles.subtitle}>
          Please do not close the app
          <br />
          or refresh the page
        </p>
      </div>
    </div>
  )
}
