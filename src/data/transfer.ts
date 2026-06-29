/**
 * Demo data + money constants for the RemitChain send-money flow.
 * Values mirror the design hand-off screens.
 */
import type { Country, Currency, Recipient, Transaction } from '../types'

/** Sender's spendable balance (NGN), in kobo-free whole naira. */
export const BALANCE = 250_000

/** Exchange rate: 1 NGN -> GHS. */
export const RATE = 0.0095

/** Flat transfer fee in NGN. */
export const FEE = 1_500

/**
 * Stablecoin reference rate — NGN per 1 USDC. The wallet settles in USDC (the
 * on-chain rail), but amounts are shown to the user in local fiat so blockchain
 * stays hidden (PRD §5, §7). Fiat conversion is mocked for the MVP.
 */
export const USDC_NGN = 1_600

/** Convert a USDC balance to its NGN display value. */
export const usdcToNgn = (usdc: number) => usdc * USDC_NGN

/** Convert an NGN amount to USDC, rounded to 2dp. Used for on-chain settlement. */
export const ngnToUsdc = (ngn: number) => Math.round((ngn / USDC_NGN) * 100) / 100

export const COUNTRIES: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
]

export const NGN: Currency = { code: 'NGN', symbol: '₦', name: 'Naira', flag: '🇳🇬' }
export const GHS: Currency = { code: 'GHS', symbol: 'GH₵', name: 'Cedi', flag: '🇬🇭' }
export const CURRENCIES: Currency[] = [NGN, GHS]

const GHANA = COUNTRIES[1]

export const CONTACTS: Recipient[] = [
  {
    id: 'r1',
    name: 'Ayobami',
    initial: 'A',
    phone: '+233 4353 674',
    wallet: 'GHS Wallet. 023 4353 674',
    country: GHANA,
    currency: GHS,
    group: 'recent',
    address: '0x1111111111111111111111111111111111111111',
  },
  {
    id: 'r2',
    name: 'Rita Wever',
    initial: 'R',
    phone: '+233 8977 132',
    wallet: 'GHS Wallet. 023 7623 863',
    country: GHANA,
    currency: GHS,
    group: 'recent',
    address: '0x2222222222222222222222222222222222222222',
  },
  {
    id: 'r3',
    name: 'Charles',
    initial: 'C',
    phone: '+233 7955 325',
    wallet: 'GHS Wallet. 023 7955 325',
    country: GHANA,
    currency: GHS,
    group: 'recent',
    address: '0x3333333333333333333333333333333333333333',
  },
]

/** Transactions shown on Home / Activity before any new transfer is made. */
export const SEED_HISTORY: Transaction[] = [
  {
    id: 't1',
    reference: 'RM104-220-911',
    name: 'Ayobami',
    initial: 'A',
    date: '25 Jun 2026',
    time: '09:12 AM',
    amount: 'N100,000',
    sentDisplay: '₦100,000.00',
    receiveDisplay: 'GHS 950.00',
    feeDisplay: '₦1,500',
    totalDisplay: '₦101,500',
    rateDisplay: '1 NGN = 0.00950 GHS',
    status: 'completed',
    recipient: CONTACTS[0],
  },
  {
    id: 't2',
    reference: 'RM118-771-204',
    name: 'Rita Wever',
    initial: 'R',
    date: '25 Jun 2026',
    time: '10:05 AM',
    amount: 'N75,000',
    sentDisplay: '₦75,000.00',
    receiveDisplay: 'GHS 712.50',
    feeDisplay: '₦1,500',
    totalDisplay: '₦76,500',
    rateDisplay: '1 NGN = 0.00950 GHS',
    status: 'processing',
    recipient: CONTACTS[1],
  },
  {
    id: 't3',
    reference: 'RM090-553-118',
    name: 'Charles',
    initial: 'C',
    date: '25 Jun 2026',
    time: '11:48 AM',
    amount: 'N20,000',
    sentDisplay: '₦20,000.00',
    receiveDisplay: 'GHS 190.00',
    feeDisplay: '₦1,500',
    totalDisplay: '₦21,500',
    rateDisplay: '1 NGN = 0.00950 GHS',
    status: 'failed',
    recipient: CONTACTS[2],
  },
]

/** Format a whole-naira figure: fmtNaira(100000) -> "100,000". */
export const fmtNaira = (n: number) => n.toLocaleString('en-US')

/** Format with 2 decimals: fmt2(950) -> "950.00". */
export const fmt2 = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
