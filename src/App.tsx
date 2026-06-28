import type { ReactElement } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
import PhoneFrame from './components/PhoneFrame'
import Onboarding1 from './screens/Onboarding1'
import Onboarding2 from './screens/Onboarding2'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import CreateAccount from './screens/CreateAccount'
import CreatePin from './screens/CreatePin'
import Confirmation from './screens/Confirmation'
import Home from './screens/Home'
import SendMoney from './screens/SendMoney'
import EnterAmount from './screens/EnterAmount'
import ReviewTransfer from './screens/ReviewTransfer'
import Processing from './screens/Processing'
import TransferSuccess from './screens/TransferSuccess'
import TrackTransfer from './screens/TrackTransfer'
import Activity from './screens/Activity'
import Profile from './screens/Profile'
import Wallet from './screens/Wallet'
import ReceiveFunds from './screens/ReceiveFunds'
import Withdraw from './screens/Withdraw'
import BackupWallet from './screens/BackupWallet'
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

/**
 * RemitChain prototype — full flow:
 * Onboarding → Welcome → Login / Create Account → Verify Email → Verify OTP →
 * Create Pin → Home → Send → Amount → Review → Processing → Success → Home.
 * In-app screens require a (mock) session; bottom-nav: Home, Activity, Profile.
 */
export default function App() {
  return (
    <HashRouter>
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
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/send" element={<RequireAuth><SendMoney /></RequireAuth>} />
          <Route path="/amount" element={<RequireAuth><EnterAmount /></RequireAuth>} />
          <Route path="/review" element={<RequireAuth><ReviewTransfer /></RequireAuth>} />
          <Route path="/processing" element={<RequireAuth><Processing /></RequireAuth>} />
          <Route path="/success" element={<RequireAuth><TransferSuccess /></RequireAuth>} />
          <Route path="/track" element={<RequireAuth><TrackTransfer /></RequireAuth>} />
          <Route path="/activity" element={<RequireAuth><Activity /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

          {/* Web3 wallet */}
          <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
          <Route path="/wallet/receive" element={<RequireAuth><ReceiveFunds /></RequireAuth>} />
          <Route path="/wallet/withdraw" element={<RequireAuth><Withdraw /></RequireAuth>} />
          <Route path="/wallet/backup" element={<RequireAuth><BackupWallet /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </HashRouter>
  )
}
