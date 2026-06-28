import { createContext, useContext, useState, type ReactNode } from 'react'
import { generateWallet, type Wallet } from './wallet'

/**
 * Mock client-side auth for the RemitChain prototype.
 *
 * There is no server: registered users and the active session are kept in
 * localStorage. The login "password" is the 6-digit PIN the user sets during
 * onboarding (the Create Account screen has no password field, the PIN screen
 * does), so the two designs stay consistent.
 *
 * A self-custodial web3 wallet is provisioned automatically when the account is
 * created — that is the core RemitChain idea: every user gets a wallet and an
 * address with no separate "connect wallet" step.
 */

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface User extends SignupData {
  /** Mock credential — the 6-digit PIN chosen during onboarding. */
  password: string
  /** Web3 wallet auto-created with the account. */
  wallet: Wallet
}

interface AuthState {
  user: User | null
  pendingSignup: SignupData | null
  /** Stash the Create Account details until the PIN step finalises them. */
  startSignup: (data: SignupData) => void
  /** Register + sign in using the chosen PIN as the password. */
  completeSignup: (pin: string) => User
  /** Sign in an existing user by email or phone + password (PIN). */
  login: (identifier: string, password: string) => User
  logout: () => void
}

const USERS_KEY = 'remitchain.users'
const SESSION_KEY = 'remitchain.session'
const PENDING_KEY = 'remitchain.pending'

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
    /* ignore quota / private-mode errors */
  }
}
function remove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

function loadUsers(): User[] {
  return read<User[]>(USERS_KEY) ?? []
}

/** Backfill a wallet onto sessions created before wallets existed. */
function ensureWallet(user: User | null): User | null {
  if (!user) return null
  if (user.wallet?.address) return user
  const upgraded: User = { ...user, wallet: generateWallet() }
  write(SESSION_KEY, upgraded)
  return upgraded
}

const digits = (s: string) => s.replace(/\D/g, '')

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => ensureWallet(read<User>(SESSION_KEY)))
  const [pendingSignup, setPendingSignup] = useState<SignupData | null>(() =>
    read<SignupData>(PENDING_KEY),
  )

  const startSignup = (data: SignupData) => {
    setPendingSignup(data)
    write(PENDING_KEY, data)
  }

  const completeSignup = (pin: string): User => {
    if (!pendingSignup) throw new Error('No signup in progress')
    // Provision the user's web3 wallet as the account is created.
    const newUser: User = { ...pendingSignup, password: pin, wallet: generateWallet() }
    // Dedupe by email so re-running the flow updates the same account.
    const users = loadUsers().filter(
      (u) => u.email.toLowerCase() !== newUser.email.toLowerCase(),
    )
    users.push(newUser)
    write(USERS_KEY, users)
    write(SESSION_KEY, newUser)
    remove(PENDING_KEY)
    setUser(newUser)
    setPendingSignup(null)
    return newUser
  }

  const login = (identifier: string, password: string): User => {
    // TEMPORARY (no backend yet): accept any email/phone + password. If a
    // matching registered account exists we reuse it; otherwise we sign in
    // with a stub user built from the entered identifier.
    // TODO: replace with real auth once the backend is available.
    const id = identifier.trim()
    const isEmail = id.includes('@')
    const existing = loadUsers().find(
      (u) => u.email.toLowerCase() === id.toLowerCase() || digits(u.phone) === digits(identifier),
    )
    const account: User =
      existing ?? {
        firstName: isEmail ? id.split('@')[0] : 'Mira',
        lastName: '',
        email: isEmail ? id : '',
        phone: isEmail ? '' : id,
        password,
        wallet: generateWallet(),
      }
    const withWallet = ensureWallet(account) as User
    write(SESSION_KEY, withWallet)
    setUser(withWallet)
    return withWallet
  }

  const logout = () => {
    remove(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, pendingSignup, startSignup, completeSignup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
