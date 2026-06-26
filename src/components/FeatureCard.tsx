import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import styles from './FeatureCard.module.css'

export interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

/** Highlighted feature card used on the onboarding carousel. */
export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn(styles.card, className)}>
      <span className={styles.iconWrap}>{icon}</span>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>
    </div>
  )
}
