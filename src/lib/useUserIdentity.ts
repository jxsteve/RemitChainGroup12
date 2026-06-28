import { usePrivy, type User as PrivyUser } from '@privy-io/react-auth'
import { useAuth, type User as MockUser } from './auth'
import { privyProfile } from './privy'

/**
 * Canonical user identity for persisting data.
 *
 * Two session layers exist today — the real Privy session and the local mock
 * onboarding session — so saves must NOT key off the mock email. This resolver
 * returns one stable identity, preferring Privy:
 *   - `userId`        — the key to store records under (Privy DID, e.g.
 *                       "did:privy:abc…"; "mock:<email|phone|addr>" otherwise).
 *   - `walletAddress` — the on-chain address (real embedded wallet, else mock).
 *
 * Use `userId` / `walletAddress` as the primary key when the on-chain / backend
 * save layer is built, never the email.
 */

export type IdentitySource = 'privy' | 'mock'

export interface UserIdentity {
  /** Stable primary key for saving user data. Null when signed out. */
  userId: string | null
  /** On-chain wallet address (real Privy embedded wallet, else mock). */
  walletAddress: string | null
  email: string | null
  phone: string | null
  name: string | null
  /** Where the identity came from; null when no session exists. */
  source: IdentitySource | null
}

const EMPTY: UserIdentity = {
  userId: null,
  walletAddress: null,
  email: null,
  phone: null,
  name: null,
  source: null,
}

/**
 * Pure resolver — usable outside React (save helpers, verifiers, tests).
 * Privy wins when authenticated; otherwise the mock session is used.
 */
export function resolveIdentity(
  privyUser: PrivyUser | null | undefined,
  authenticated: boolean,
  mockUser: MockUser | null,
): UserIdentity {
  if (authenticated && privyUser) {
    const p = privyProfile(privyUser)
    return {
      userId: privyUser.id, // Privy DID — globally unique + stable
      walletAddress: privyUser.wallet?.address ?? mockUser?.wallet?.address ?? null,
      email: p.email,
      phone: p.phone,
      name: p.name,
      source: 'privy',
    }
  }

  if (mockUser) {
    const seed = (mockUser.email || mockUser.phone || mockUser.wallet?.address || '').toLowerCase()
    return {
      userId: seed ? `mock:${seed}` : null,
      walletAddress: mockUser.wallet?.address ?? null,
      email: mockUser.email || null,
      phone: mockUser.phone || null,
      name: `${mockUser.firstName} ${mockUser.lastName}`.trim() || null,
      source: 'mock',
    }
  }

  return EMPTY
}

/** Component-facing hook returning the canonical identity. */
export function useUserIdentity(): UserIdentity {
  const { authenticated, user: privyUser } = usePrivy()
  const { user } = useAuth()
  return resolveIdentity(privyUser, authenticated, user)
}
