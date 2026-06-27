/* ============================================================
   RemitChain — shared TypeScript types (single source of truth)
   ============================================================ */

export type TransactionStatus = 'completed' | 'processing' | 'failed'

export interface Transaction {
  id: string
  /** Human-facing reference, e.g. "RM278-823-673". */
  reference: string
  name: string
  initial: string
  date: string
  time: string
  /** Sent amount, display string e.g. "N100,000". */
  amount: string
  /** Sent amount with decimals, e.g. "N100,000.00". */
  sentDisplay: string
  /** What the recipient gets, e.g. "GHS 950.00". */
  receiveDisplay: string
  feeDisplay: string
  totalDisplay: string
  rateDisplay: string
  status: TransactionStatus
  recipient: Recipient
}

export interface Country {
  code: string
  name: string
  /** Emoji flag for quick rendering. */
  flag: string
  currency: string
}

export interface Currency {
  code: string
  /** Symbol used inline, e.g. "₦" or "GH₵". */
  symbol: string
  name: string
  flag: string
}

export interface Recipient {
  id: string
  name: string
  initial: string
  phone: string
  /** Destination wallet account number. */
  wallet: string
  country: Country
  /** Currency the recipient receives in. */
  currency: Currency
  /** Which list the contact belongs to in the picker. */
  group: 'recent' | 'saved' | 'all'
}

/** Visual variants shared across UI primitives. */
export type ButtonVariant = 'primary' | 'outline' | 'dark'
export type ChipVariant = 'default' | 'selected' | 'dark'

/** Bottom navigation destinations. */
export type NavKey = 'home' | 'send' | 'activity' | 'profile'
