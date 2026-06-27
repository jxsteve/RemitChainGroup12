import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import shared from './shared.module.css'
import styles from './Onboarding1.module.css'

export default function Onboarding1() {
  const navigate = useNavigate()

  return (
    <div className={shared.screen}>

        <div className={shared.topbar}>
          <Logo size={26} />
        </div>

        <div className={shared.body} style={{ marginTop: 36 }}>
          <h1 className={shared.h1}>
            The future of Banking,
            <br />
            built for everyone.
          </h1>
          <p className={shared.lead}>Fast, Secured, Transparent. Send money across borders with confidence.</p>

          <div className={styles.hero}>
           <img src="/img/image 2.png" alt="" />
          
          </div>
        </div>

      <div className={shared.bottom}>
        <Button fullWidth onClick={() => navigate('/onboarding')}>
          Get Started
        </Button>
        <p className={shared.footnote}>
          Already have an account?
          <button className={shared.link} onClick={() => navigate('/login')}>
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}
