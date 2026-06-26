import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { AVAILABLE_BALANCE } from '../data/transfer'

export default function EnterAmount() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title="Enter Amount" />

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {/* You send */}
        <label className="text-base font-semibold text-gray-900">You send</label>
        <div className="mt-2 rounded-xl border-2 border-danger bg-primary px-5 py-4 shadow-card">
          <span className="text-lg font-semibold text-white">N100,000</span>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-700">
          Available Balance: {' '}
          <span className="font-semibold">{AVAILABLE_BALANCE}</span>
        </p>

        {/* Exchange rate */}
        <div className="mt-8 rounded-xl border-2 border-danger bg-primary-700 px-5 py-5 shadow-card">
          <p className="text-base font-semibold text-white">Exchange Rate</p>
          <p className="mt-1 text-base font-medium text-blue-100">
            1 NGN + 0.0096 GHS
          </p>
        </div>

        {/* Recipient receives */}
        <label className="mt-8 block text-base font-semibold text-gray-900">
          Recipient Receives
        </label>
        <div className="mt-2 rounded-xl border-2 border-danger bg-primary px-5 py-4 shadow-card">
          <span className="text-lg font-semibold text-white">GHS 950.00</span>
        </div>

        {/* Continue */}
        <Button variant="primary" fullWidth className="mt-8 mb-6" onClick={() => navigate('/review')}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
