/**
 * Per-user persistence layer.
 *
 * All user data is stored under a single key namespaced by the canonical
 * `userId` (see useUserIdentity) — never the email — so each account's data is
 * isolated and the move to a real backend is a one-function change.
 *
 * The API is already async and goes through a single `driver`. To switch from
 * localStorage to the on-chain / REST store, implement the `StoreDriver`
 * interface once and call `setUserStoreDriver(...)` at startup. No call site
 * changes.
 */

/** Shape of a saved user record. Open-ended; sections are optional. */
export interface UserData {
  profile?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    name?: string
  }
  wallet?: {
    address?: string
    network?: string
    asset?: string
    balance?: number
    backedUp?: boolean
  }
  /** On-chain wallet activity feed. */
  activity?: unknown[]
  /** Transfer history. */
  history?: unknown[]
  [key: string]: unknown
}

/** The one seam to reimplement for a real backend. */
export interface StoreDriver {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  remove(key: string): Promise<void>
}

const NAMESPACE = 'remitchain.user'

/** Storage key for a user: "remitchain.user:<userId>". */
export function userKey(userId: string): string {
  return `${NAMESPACE}:${userId}`
}

/** Default driver — synchronous localStorage wrapped in promises. */
const localStorageDriver: StoreDriver = {
  async get(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* ignore quota / private-mode errors */
    }
  },
  async remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}

let driver: StoreDriver = localStorageDriver

/** Swap the persistence backend (on-chain / API). Call once at startup. */
export function setUserStoreDriver(next: StoreDriver): void {
  driver = next
}

/** Overwrite a user's full record. */
export async function saveUserData(userId: string, data: UserData): Promise<void> {
  if (!userId) return
  await driver.set(userKey(userId), JSON.stringify(data))
}

/** Load a user's full record, or null if none / unparseable. */
export async function loadUserData(userId: string): Promise<UserData | null> {
  if (!userId) return null
  const raw = await driver.get(userKey(userId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserData
  } catch {
    return null
  }
}

/** Shallow-merge a partial update into a user's record and return the result. */
export async function patchUserData(userId: string, partial: UserData): Promise<UserData> {
  const current = (await loadUserData(userId)) ?? {}
  const next: UserData = { ...current, ...partial }
  await saveUserData(userId, next)
  return next
}

/** Delete a user's record entirely. */
export async function clearUserData(userId: string): Promise<void> {
  if (!userId) return
  await driver.remove(userKey(userId))
}
