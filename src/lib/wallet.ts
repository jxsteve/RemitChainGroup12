/**
 * Web3 wallet primitives for the RemitChain prototype.
 *
 * Every account gets a self-custodial wallet the moment it is created. The
 * wallet holds a USDC stablecoin balance that acts as the bridge asset for
 * cross-Africa transfers: the sender funds the wallet, value moves on-chain as
 * USDC, and the recipient cashes out in their local currency.
 *
 * Generation here is MOCK (no real keypair / RPC). It produces realistic-
 * looking values so the UI is complete, and is the single seam where the real
 * on-chain SDK will plug in once the Web3 team hands over the contract
 * interface. See the on-chain-backend project note.
 */

/** The stablecoin every RemitChain wallet settles in. */
export const WALLET_ASSET = 'USDC'

/**
 * Human-facing network label. Kept abstract on purpose — the chain is not yet
 * finalised — but address formatting is EVM-style, the most familiar default.
 */
export const WALLET_NETWORK = 'Polygon'

export interface Wallet {
  /** 0x-prefixed account address (mock). */
  address: string
  /** Network the address lives on. */
  network: string
  /** Settlement asset held by the wallet. */
  asset: string
  /** ISO timestamp the wallet was provisioned. */
  createdAt: string
}

const HEX = '0123456789abcdef'

/** A short word list, enough to render a believable 12-word recovery phrase. */
const WORDLIST = [
  'anchor', 'beacon', 'cobalt', 'dawn', 'ember', 'falcon', 'glade', 'harbor',
  'ivory', 'jasmine', 'kernel', 'lagoon', 'meadow', 'nimbus', 'orbit', 'pioneer',
  'quartz', 'ripple', 'summit', 'timber', 'umber', 'velvet', 'willow', 'zephyr',
  'amber', 'breeze', 'cedar', 'delta', 'echo', 'forest', 'granite', 'hollow',
]

/** Pick `count` deterministic-but-varied hex characters. */
function hex(count: number): string {
  let out = ''
  for (let i = 0; i < count; i++) out += HEX[Math.floor(Math.random() * 16)]
  return out
}

/** Generate a mock 0x address, e.g. "0x9f3c...". */
export function generateAddress(): string {
  return `0x${hex(40)}`
}

/** Generate a mock 12-word BIP39-style recovery phrase. */
export function generateMnemonic(words = 12): string[] {
  return Array.from({ length: words }, () => WORDLIST[Math.floor(Math.random() * WORDLIST.length)])
}

/** Provision a fresh wallet for a newly created account. */
export function generateWallet(): Wallet {
  return {
    address: generateAddress(),
    network: WALLET_NETWORK,
    asset: WALLET_ASSET,
    createdAt: new Date().toISOString(),
  }
}

/** Truncate an address for display: "0x9f3c…7b21". */
export function shortAddress(address: string, lead = 6, tail = 4): string {
  if (address.length <= lead + tail) return address
  return `${address.slice(0, lead)}…${address.slice(-tail)}`
}

/** Format a USDC figure with 2 decimals, e.g. fmtUsdc(540) -> "540.00". */
export const fmtUsdc = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
