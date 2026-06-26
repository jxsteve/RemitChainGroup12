import { Signal, Wifi, BatteryMedium } from 'lucide-react'

/** iOS-style status bar shown at the top of every device screen. */
export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[15px] font-semibold text-gray-800">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-4 w-4" strokeWidth={2.5} />
        <Wifi className="h-4 w-4" strokeWidth={2.5} />
        <BatteryMedium className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
  )
}
