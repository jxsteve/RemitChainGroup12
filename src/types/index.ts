/* ============================================================
   RemitChain — shared TypeScript types (single source of truth)
   ============================================================ */

export type TransactionStatus = 'completed' | 'processing' | 'failed'

export interface Transaction {
  id: string
  name: string
  initial: string
  date: string
  amount: string
  status: TransactionStatus
}

export interface Country {
  code: string
  name: string
  /** Emoji flag for quick rendering. */
  flag: string
  currency: string
}

/** Visual variants shared across UI primitives. */
export type ButtonVariant = 'primary' | 'outline' | 'dark'
export type ChipVariant = 'default' | 'selected' | 'dark'

/** Bottom navigation destinations. */
export type NavKey = 'home' | 'send' | 'activity' | 'profile'
