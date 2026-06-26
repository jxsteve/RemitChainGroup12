import type { ReactNode } from 'react'
import styles from './PhoneFrame.module.css'

interface PhoneFrameProps {
  children: ReactNode
}

/**
 * Centers the active screen inside a fixed 390×844 device viewport.
 * (No status bar — clock / signal / battery removed per the latest design.)
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.device}>
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  )
}
