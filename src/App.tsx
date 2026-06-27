import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import Onboarding1 from './screens/Onboarding1'
import Onboarding2 from './screens/Onboarding2'
import Welcome from './screens/Welcome'
import CreateAccount from './screens/CreateAccount'
import VerifyEmail from './screens/VerifyEmail'
import VerifyOtp from './screens/VerifyOtp'
import CreatePin from './screens/CreatePin'
import Home from './screens/Home'
import SendMoney from './screens/SendMoney'
import EnterAmount from './screens/EnterAmount'
import ReviewTransfer from './screens/ReviewTransfer'
import Processing from './screens/Processing'
import TransferSuccess from './screens/TransferSuccess'
import Activity from './screens/Activity'
import Profile from './screens/Profile'
import Login from "./screens/Login";
/**
 * RemitChain prototype — full flow:
 * Onboarding → Welcome → Create Account → Verify Email → Verify OTP →
 * Create Pin → Home → Send → Amount → Review → Processing → Success → Home.
 * Bottom-nav destinations: Home, Activity (history), Profile.
 */
export default function App() {
  return (
    <HashRouter>
      <PhoneFrame>
        <Routes>
          {/* Onboarding & auth */}
          <Route path="/" element={<Onboarding1 />} />
          <Route path="/onboarding" element={<Onboarding2 />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/create-pin" element={<CreatePin />} />

          {/* App */}
          <Route path="/home" element={<Home />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/amount" element={<EnterAmount />} />
          <Route path="/review" element={<ReviewTransfer />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/success" element={<TransferSuccess />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </HashRouter>
  )
}
