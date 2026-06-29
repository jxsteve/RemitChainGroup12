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
        <div style={{ padding: '28px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <Logo size={26} />
        </div>

        <div className={shared.body} style={{ marginTop: 24 }}>
          <h1 className={shared.h1} style={{ textAlign: 'center' }}>
            Borderless transfers,
            <br />
            Limitless possibilities.
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
            <FeatureCard
              icon={<Zap size={22} fill="currentColor" />}
              title="Fast Transfer"
              description="Send money in minutes with lightening-fast processing."
            />
            <FeatureCard
              icon={<Lock size={22} />}
              title="Bank-Grade Security"
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-border-strong)' }} />
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-accent)' }} />
        </div>
        <Button fullWidth onClick={() => navigate('/welcome')}>
          Next
        </Button>
      </div>
    </div>
  )
}
