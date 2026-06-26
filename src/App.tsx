import { HashRouter, Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import Home from './screens/Home'
import SendMoney from './screens/SendMoney'
import EnterAmount from './screens/EnterAmount'
import ReviewTransfer from './screens/ReviewTransfer'
import Processing from './screens/Processing'

/**
 * RemitChain send-money prototype.
 * Five screens wired together in the order of the design hand-off:
 * Home → Send Money → Enter Amount → Review Transfer → Processing.
 */
export default function App() {
  return (
    <HashRouter>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/amount" element={<EnterAmount />} />
          <Route path="/review" element={<ReviewTransfer />} />
          <Route path="/processing" element={<Processing />} />
        </Routes>
      </PhoneFrame>
    </HashRouter>
  )
}
