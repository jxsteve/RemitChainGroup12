import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Recipient, Transaction } from '../types'
import { CONTACTS, FEE, RATE, SEED_HISTORY, fmt2, fmtNaira, ngnToUsdc, usdcToNgn } from '../data/transfer'
import { useWallet } from './walletStore'

/**
 * Transfer "backend" for the prototype.
 *
 * Holds the in-progress transfer (recipient + amount), derives the fee / rate /
 * recipient-gets / total, and records committed transactions in a localStorage
 * history that powers Home, Activity, Processing, Success and Track screens.
 */

interface TransferState {
  // Draft (in-progress transfer)
  recipient: Recipient | null
  setRecipient: (r: Recipient | null) => void
  sendAmount: number
  setSendAmount: (n: number) => void
  resetDraft: () => void

  // Money constants / derived values
  balance: number
  fee: number
  rate: number
  receiveAmount: number
  total: number

  // Records
  history: Transaction[]
  current: Transaction | null
  /** Build a processing transaction from the draft and record it. */
  commitTransfer: () => Transaction
  /** Mark the current transaction completed (optionally with an on-chain hash). */
  completeTransfer: (hash?: string) => void
  /** Mark the current transaction failed (e.g. an on-chain revert). */
  failTransfer: () => void
}

const HISTORY_KEY = 'remitchain.history'
const CURRENT_KEY = 'remitchain.current'

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

function genReference(): string {
  const part = () => String(Math.floor(100 + Math.random() * 900))
  return `RM${part()}-${part()}-${part()}`
}

const TransferContext = createContext<TransferState | null>(null)

export function TransferProvider({ children }: { children: ReactNode }) {
  // The USDC wallet is the single source of truth for spendable funds; the
  // NGN figure shown across the send flow is its local-fiat equivalent.
  const { balance: walletBalance, send: sendFromWallet } = useWallet()
  const [recipient, setRecipient] = useState<Recipient | null>(null)
  const [sendAmount, setSendAmount] = useState<number>(0)
  const [history, setHistory] = useState<Transaction[]>(
    () => read<Transaction[]>(HISTORY_KEY) ?? SEED_HISTORY,
  )
  const [current, setCurrent] = useState<Transaction | null>(() => read<Transaction>(CURRENT_KEY))

  const balance = Math.round(usdcToNgn(walletBalance))
  const receiveAmount = Math.round(sendAmount * RATE * 100) / 100
  const total = sendAmount + FEE

  const resetDraft = () => {
    setRecipient(null)
    setSendAmount(0)
  }

  const commitTransfer = (): Transaction => {
    const ref = genReference()
    const now = new Date()
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    const txn: Transaction = {
      id: ref,
      reference: ref,
      name: recipient?.name ?? 'Recipient',
      initial: recipient?.initial ?? 'R',
      date,
      time,
      amount: `N${fmtNaira(sendAmount)}`,
      sentDisplay: `₦${fmt2(sendAmount)}`,
      receiveDisplay: `GHS ${fmt2(receiveAmount)}`,
      feeDisplay: `₦${fmtNaira(FEE)}`,
      totalDisplay: `₦${fmtNaira(total)}`,
      rateDisplay: `1 NGN = ${RATE.toFixed(5)} GHS`,
      status: 'processing',
      recipient: recipient ?? CONTACTS[1],
    }

    // Debit the USDC wallet and log the send as on-chain activity, so the
    // wallet balance + activity stay consistent with the transfer history.
    sendFromWallet(ngnToUsdc(total), recipient?.name ?? 'Recipient')

    const next = [txn, ...history]
    setHistory(next)
    setCurrent(txn)
    write(HISTORY_KEY, next)
    write(CURRENT_KEY, txn)
    return txn
  }

  const updateCurrent = (patch: Partial<Transaction>) => {
    if (!current) return
    const updated: Transaction = { ...current, ...patch }
    const next = history.map((t) => (t.id === updated.id ? updated : t))
    setHistory(next)
    setCurrent(updated)
    write(HISTORY_KEY, next)
    write(CURRENT_KEY, updated)
  }

  const completeTransfer = (hash?: string) =>
    updateCurrent({ status: 'completed', ...(hash ? { hash } : {}) })

  const failTransfer = () => updateCurrent({ status: 'failed' })

  return (
    <TransferContext.Provider
      value={{
        recipient,
        setRecipient,
        sendAmount,
        setSendAmount,
        resetDraft,
        balance,
        fee: FEE,
        rate: RATE,
        receiveAmount,
        total,
        history,
        current,
        commitTransfer,
        completeTransfer,
        failTransfer,
      }}
    >
      {children}
    </TransferContext.Provider>
  )
}

export function useTransfer(): TransferState {
  const ctx = useContext(TransferContext)
  if (!ctx) throw new Error('useTransfer must be used within TransferProvider')
  return ctx
}
