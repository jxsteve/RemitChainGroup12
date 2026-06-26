/**
 * Shared demo data for the RemitChain send-money flow.
 * Values mirror the design hand-off screens.
 */
import type { Transaction, Country } from '../types'

export const AVAILABLE_BALANCE = 'N250,000.00'

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 't1', name: 'Ayobami', initial: 'A', date: '25 Jun 2026', amount: 'N100,000', status: 'completed' },
  { id: 't2', name: 'Rita wever', initial: 'R', date: '25 Jun 2026', amount: 'N75,000', status: 'processing' },
  { id: 't3', name: 'Charles', initial: 'C', date: '25 Jun 2026', amount: 'N20,000', status: 'failed' },
]

export const COUNTRIES: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
]
