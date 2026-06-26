/**
 * Shared demo data for the RemitChain send-money flow.
 * Values mirror the design hand-off screens.
 */

// Re-exported so screens and the data layer share one status union.
export type { TransactionStatus } from '../components/StatusBadge'
import type { TransactionStatus } from '../components/StatusBadge'

export interface Transaction {
  id: string
  name: string
  initial: string
  date: string
  amount: string
  status: TransactionStatus
}

export const AVAILABLE_BALANCE = 'N250,000.00'

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    name: 'Ayobami',
    initial: 'A',
    date: '25 Jun 2026',
    amount: 'N100,000',
    status: 'completed',
  },
  {
    id: 't2',
    name: 'Rita wever',
    initial: 'R',
    date: '25 Jun 2026',
    amount: 'N75,000',
    status: 'processing',
  },
  {
    id: 't3',
    name: 'Charles',
    initial: 'C',
    date: '25 Jun 2026',
    amount: 'N20,000',
    status: 'failed',
  },
]

export interface Country {
  code: string
  name: string
  flag: string
  currency: string
}

export const COUNTRIES: Country[] = [
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
]
