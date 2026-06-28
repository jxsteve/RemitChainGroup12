import { createContext, useContext, useState, type ReactNode } from 'react'
import { WALLET_ASSET } from './wallet'

/**
 * Wallet "ledger" for the prototype.
 *
 * Holds the USDC stablecoin balance, the on-chain activity feed (deposits,
 * withdrawals, sends, receives) and the backup state of the recovery phrase.
 * All mock + localStorage; this is the seam where on-chain reads/writes land.
 */

export type WalletTxType = 'deposit' | 'withdraw' | 'send' | 'receive'

export interface WalletTx {
  id: string
  type: WalletTxType
  /** Counterparty / source label, e.g. "Card top-up" or "Ayobami". */
  label: string
  /** Signed amount in USDC; negative for outgoing. */
  amount: number
  date: string
  time: string
  status: 'completed' | 'processing' | 'failed'
  /** Mock transaction hash for the on-chain feel. */
  hash: string
}

interface WalletState {
  /** Spendable stablecoin balance in USDC. */
  balance: number
  asset: string
  activity: WalletTx[]
  /** Whether the user has saved their recovery phrase. */
  backedUp: boolean
  confirmBackup: () => void
  /** Top up the wallet (fiat on-ramp → USDC). */
  deposit: (amount: number, source: string) => void
  /** Cash out to a local bank / mobile-money account. */
  withdraw: (amount: number, destination: string) => void
}

const BALANCE_KEY = 'remitchain.wallet.balance'
const ACTIVITY_KEY = 'remitchain.wallet.activity'
const BACKUP_KEY = 'remitchain.wallet.backedUp'

const DEFAULT_BALANCE = 540

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function genHash(): string {
  const HEX = '0123456789abcdef'
  let out = '0x'
  for (let i = 0; i < 16; i++) out += HEX[Math.floor(Math.random() * 16)]
  return out
}

function stamp() {
  const now = new Date()
  return {
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

const SEED_ACTIVITY: WalletTx[] = [
  {
    id: 'w1',
    type: 'deposit',
    label: 'Card top-up',
    amount: 600,
    date: '24 Jun 2026',
    time: '08:30 AM',
    status: 'completed',
    hash: '0x4a91c0e7f2b3a8d1',
  },
  {
    id: 'w2',
    type: 'send',
    label: 'To Ayobami',
    amount: -60,
    date: '25 Jun 2026',
    time: '09:12 AM',
    status: 'completed',
    hash: '0x7c3e9b1d6f0a2e84',
  },
]

const WalletContext = createContext<WalletState | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(() => read<number>(BALANCE_KEY) ?? DEFAULT_BALANCE)
  const [activity, setActivity] = useState<WalletTx[]>(
    () => read<WalletTx[]>(ACTIVITY_KEY) ?? SEED_ACTIVITY,
  )
  const [backedUp, setBackedUp] = useState<boolean>(() => read<boolean>(BACKUP_KEY) ?? false)

  const record = (tx: WalletTx, nextBalance: number) => {
    const nextActivity = [tx, ...activity]
    setActivity(nextActivity)
    setBalance(nextBalance)
    write(ACTIVITY_KEY, nextActivity)
    write(BALANCE_KEY, nextBalance)
  }

  const deposit = (amount: number, source: string) => {
    if (amount <= 0) return
    const next = Math.round((balance + amount) * 100) / 100
    record(
      { id: genHash(), type: 'deposit', label: source, amount, ...stamp(), status: 'completed', hash: genHash() },
      next,
    )
  }

  const withdraw = (amount: number, destination: string) => {
    if (amount <= 0 || amount > balance) return
    const next = Math.round((balance - amount) * 100) / 100
    record(
      { id: genHash(), type: 'withdraw', label: destination, amount: -amount, ...stamp(), status: 'processing', hash: genHash() },
      next,
    )
  }

  const confirmBackup = () => {
    setBackedUp(true)
    write(BACKUP_KEY, true)
  }

  return (
    <WalletContext.Provider
      value={{ balance, asset: WALLET_ASSET, activity, backedUp, confirmBackup, deposit, withdraw }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
