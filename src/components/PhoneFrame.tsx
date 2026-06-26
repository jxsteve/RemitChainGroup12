import type { ReactNode } from 'react'
import StatusBar from './StatusBar'

interface PhoneFrameProps {
  children: ReactNode
}

/**
 * Centers the active screen inside a fixed 390×844 device viewport,
 * so every screen renders at a consistent phone size.
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[2.25rem] bg-canvas shadow-2xl ring-1 ring-black/5">
        <StatusBar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}
