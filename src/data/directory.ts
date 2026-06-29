/**
 * RemitChain recipient directory.
 *
 * A set of people the user can send money to, generated from the team roster.
 * Each person gets a deterministic email, phone number and on-chain (Celo)
 * address derived from their name, so the same name always resolves to the same
 * identifiers. Used by the Send Money screen: typing a wallet address, phone
 * number or email surfaces (or generates) a matching recipient from this list.
 */
import type { Recipient } from '../types'
import { COUNTRIES, GHS } from './transfer'

const GHANA = COUNTRIES[1]

/** Names sourced from the team roster spreadsheet. */
export const DIRECTORY_NAMES = [
  'Samuel John',
  'Chizurum Onyekwere',
  'Chidera Okoroafor',
  'Charles Ogbu',
  'Chinaza Remigius Chigbata',
  'Fawaz Mohammed',
  'Tolulope Adeotan',
  'Kingsley Okoronkwo',
  'Favour Ejinna',
  'Timothy Otu',
  'Peace Ugwu',
  'Favour Stephen',
  'Chukwudubem Ndukwe',
  'Stephen Ogbodo',
  'Miracle Igboanusi',
  'Ngozi Onwuka',
  'Chukwuemela Okoronkwo',
  'Wever Rita',
  'Ayobami Odubiyi',
  'Chinonye Esther Okezie',
  'Matthew Israel',
  'Somtochukwu Iloabachie',
  'Jane Amasiobi',
  'Emmanuel Abumchionye',
]

/** Stable 32-bit hash of a string (FNV-1a) for deterministic generation. */
function hash(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** firstname.lastname@gmail.com, stripped of accents/spaces. */
export function emailFor(name: string): string {
  const parts = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
  const handle = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0] || 'user'
  return `${handle}@gmail.com`
}

/** Deterministic Ghana phone number, e.g. "+233 24 781 5532". */
export function phoneFor(name: string): string {
  const n = hash('phone:' + name)
  const a = 20 + (n % 9) // 20–28 (MTN/Vodafone-style prefixes)
  const b = String(100 + ((n >> 4) % 900))
  const c = String(1000 + ((n >> 12) % 9000))
  return `+233 ${a} ${b} ${c}`
}

/** Deterministic 0x EVM address derived from the name. */
export function addressFor(name: string): string {
  const HEX = '0123456789abcdef'
  let seed = hash('addr:' + name)
  let out = '0x'
  for (let i = 0; i < 40; i++) {
    seed = Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) >>> 0
    out += HEX[seed & 0xf]
  }
  return out
}

/** Build a full recipient record for a name. */
export function recipientFor(name: string, index = 0): Recipient {
  // First few are "recent", next few "saved", rest "all" — gives the tabs content.
  const group: Recipient['group'] = index < 4 ? 'recent' : index < 8 ? 'saved' : 'all'
  const address = addressFor(name)
  return {
    id: `dir-${hash(name).toString(36)}`,
    name,
    initial: name.charAt(0).toUpperCase(),
    phone: phoneFor(name),
    email: emailFor(name),
    wallet: `GHS Wallet · ${address.slice(0, 6)}…${address.slice(-4)}`,
    address,
    country: GHANA,
    currency: GHS,
    group,
  }
}

export const DIRECTORY: Recipient[] = DIRECTORY_NAMES.map((name, i) => recipientFor(name, i))

/**
 * Resolve a typed identifier (wallet address, phone or email) to a recipient.
 * If it matches someone in the directory, return them; otherwise generate a
 * recipient from the roster (a stable name picked from the identifier) and
 * attach the entered identifier so the user can still send to it.
 */
export function resolveIdentifier(
  raw: string,
  kind: 'email' | 'phone' | 'wallet',
): Recipient {
  const id = raw.trim()
  const lower = id.toLowerCase()
  const digits = id.replace(/\D/g, '')

  const match = DIRECTORY.find((r) => {
    if (kind === 'email') return r.email?.toLowerCase() === lower
    if (kind === 'wallet') return r.address?.toLowerCase() === lower
    return r.phone.replace(/\D/g, '') === digits
  })
  if (match) return match

  // No match — generate a user from the roster, keyed off the identifier.
  const name = DIRECTORY_NAMES[hash(id) % DIRECTORY_NAMES.length]
  const base = recipientFor(name)
  return {
    ...base,
    id: `typed-${lower}`,
    email: kind === 'email' ? id : base.email,
    phone: kind === 'phone' ? id : base.phone,
    address: kind === 'wallet' ? id : base.address,
    wallet:
      kind === 'wallet' ? `GHS Wallet · ${id.slice(0, 6)}…${id.slice(-4)}` : base.wallet,
  }
}
