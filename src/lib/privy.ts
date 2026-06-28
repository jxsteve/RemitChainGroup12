import type { PrivyClientConfig, User } from '@privy-io/react-auth'

/**
 * Privy app ID — this is a PUBLIC identifier (safe in the frontend bundle).
 * Override per-environment with VITE_PRIVY_APP_ID; the fallback is the
 * RemitChain dashboard app so the deployed build always has a valid id.
 *
 * The App *Secret* is server-side only and must never appear here.
 */
export const PRIVY_APP_ID =
  (import.meta.env.VITE_PRIVY_APP_ID as string | undefined) || 'cmqxjwsuv003i0djpjj0sil43'

/**
 * Server-side access-token verification config. The FRONTEND never uses these —
 * they belong to whatever verifies a Privy JWT before an on-chain action (edge
 * function / relayer / contract gateway). Flow: client calls `getAccessToken()`,
 * attaches the JWT; the verifier validates it against the JWKS with ES256,
 * checking issuer === PRIVY_ISSUER and audience === PRIVY_APP_ID.
 *
 * All three are derived from the app id, so they stay correct if it changes.
 */
export const PRIVY_ISSUER = 'privy.io'
/** The token audience is the app id. */
export const PRIVY_AUDIENCE = PRIVY_APP_ID
/** Public JWKS (ES256 / P-256 keys) used to verify Privy-issued JWTs. */
export const PRIVY_JWKS_URL = `https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`

/**
 * Real Privy auth + an embedded wallet auto-created for new accounts.
 *
 * NOTE: Privy embedded wallets require a *secure context* — i.e. HTTPS or
 * http://localhost. Production (Netlify) is HTTPS and local dev on
 * http://localhost both qualify. Accessing the dev server over a bare LAN IP
 * (e.g. http://192.168.x.x for phone testing) is NOT a secure context and Privy
 * will throw "Embedded wallet is only available over HTTPS" — use localhost or
 * an HTTPS tunnel (e.g. `ngrok`) for device testing.
 */
export const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: 'light',
    accentColor: '#1D3FC4',
    walletChainType: 'ethereum-only',
  },
  loginMethods: ['email', 'sms', 'wallet'],
  // Auto-provision a self-custodial embedded wallet for every account that
  // doesn't already have one — the core RemitChain idea ("sign up → you have a
  // wallet"). Note: embedded wallets must also be enabled for this app in the
  // Privy dashboard. In v3 this option is nested per chain type.
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
}

/** Derive a friendly display name / email / phone from a Privy user. */
export function privyProfile(user: User | null | undefined): {
  name: string | null
  email: string | null
  phone: string | null
} {
  const email = user?.email?.address ?? user?.google?.email ?? null
  const phone = user?.phone?.number ?? null
  const walletAddr = user?.wallet?.address ?? null
  const name =
    user?.google?.name ??
    (email ? email.split('@')[0] : null) ??
    phone ??
    (walletAddr ? `${walletAddr.slice(0, 6)}…${walletAddr.slice(-4)}` : null)
  return { name, email, phone }
}
