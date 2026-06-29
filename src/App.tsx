import { useEffect, useState, type ReactElement } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
import { useIdleLogout } from './lib/useIdleLogout'
import PhoneFrame from './components/PhoneFrame'
import Splash from './screens/Splash'
import Onboarding1 from './screens/Onboarding1'
import Onboarding2 from './screens/Onboarding2'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import CreateAccount from './screens/CreateAccount'
import CreatePin from './screens/CreatePin'
import Confirmation from './screens/Confirmation'
import SendMoney from './screens/SendMoney'
import EnterAmount from './screens/EnterAmount'
import FeeComparison from './screens/FeeComparison'
import ReviewTransfer from './screens/ReviewTransfer'
import Processing from './screens/Processing'
import TransferSuccess from './screens/TransferSuccess'
import TrackTransfer from './screens/TrackTransfer'
import Activity from './screens/Activity'
import Profile from './screens/Profile'
import Wallet from './screens/Wallet'
import { useAuth } from './lib/auth'

/**
 * Guards in-app screens. A session is either a real Privy login or the
 * mock onboarding session — redirects to /login when neither is present.
 */
function RequireAuth({ children }: { children: ReactElement }) {
  const { ready, authenticated } = usePrivy()
  const { user } = useAuth()
  if (!ready) return null
  return authenticated || user ? children : <Navigate to="/login" replace />
}

/** Signs the user out after inactivity so a fresh OTP is required on return. */
function SessionGuard() {
  useIdleLogout()
  return null
}

/**
 * RemitChain prototype — full flow:
 * Onboarding → Welcome → Login / Create Account → Verify Email → Verify OTP →
 * Create Pin → Home → Send → Amount → Review → Processing → Success → Home.
 * In-app screens require a (mock) session; bottom-nav: Home, Activity, Profile.
 */
export default function App() {
  // Brand splash on app start, ~2.5s, then the app.
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500)
    return () => clearTimeout(t)
  }, [])

  if (showSplash) {
    return (
      <PhoneFrame>
        <Splash />
      </PhoneFrame>
    )
  }

  return (
    <HashRouter>
      <SessionGuard />
      <PhoneFrame>
        <Routes>
          {/* Onboarding & auth (public) */}
          <Route path="/" element={<Onboarding1 />} />
          <Route path="/onboarding" element={<Onboarding2 />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route path="/confirmation" element={<Confirmation />} />

          {/* App (requires a session) */}
          {/* Home is the Wallet screen — the app's landing/dashboard. */}
          <Route path="/home" element={<RequireAuth><Wallet /></RequireAuth>} />
          <Route path="/send" element={<RequireAuth><SendMoney /></RequireAuth>} />
          <Route path="/amount" element={<RequireAuth><EnterAmount /></RequireAuth>} />
          <Route path="/compare" element={<RequireAuth><FeeComparison /></RequireAuth>} />
          <Route path="/review" element={<RequireAuth><ReviewTransfer /></RequireAuth>} />
          <Route path="/processing" element={<RequireAuth><Processing /></RequireAuth>} />
          <Route path="/success" element={<RequireAuth><TransferSuccess /></RequireAuth>} />
          <Route path="/track" element={<RequireAuth><TrackTransfer /></RequireAuth>} />
          <Route path="/activity" element={<RequireAuth><Activity /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

          {/* Web3 wallet */}
          <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </HashRouter>
  )
}
