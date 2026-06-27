import { useNavigate } from 'react-router-dom'
import { Eye, Zap, Lock } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { FeatureCard } from '../components/FeatureCard'
import shared from './shared.module.css'

export default function Onboarding2() {
  const navigate = useNavigate()

  return (
    <div className={shared.screen}>
      <div className={shared.scroll}>
        <div className={shared.topbar}>
          <Logo size={26} />
        </div>

        <div className={shared.body} style={{ marginTop: 36 }}>
          <h1 className={shared.h1}>
            Borderless transfers,
            <br />
            Limitless possibilities.
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 56, marginTop: 36 }}>
            <FeatureCard
              icon={<Zap size={22} fill="currentColor" />}
              title="Fast Transfer"
              description="Send money in minutes with lightening-fast processing."
            />
             <FeatureCard
              icon={<Lock size={22} />}
              title=" Bank-Grade Security"

              description="Your money and data are protected with advanced encryption."
            />
            <FeatureCard
              icon={<Eye size={22} />}
              title="Full Transparency"
              description="Your money and data are protected with advanced encryption."
            />
          </div>
        </div>
      </div>

      <div className={shared.bottom}>
        <Button fullWidth onClick={() => navigate('/welcome')}>
          Next
        </Button>
      </div>
    </div>
  )
}
