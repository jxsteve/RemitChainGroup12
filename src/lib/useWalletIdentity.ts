import { usePrivy } from '@privy-io/react-auth'
import { useAuth } from './auth'
import { WALLET_ASSET, WALLET_NETWORK } from './wallet'

/**
 * Single source of truth for "which wallet address do we show".
 *
 * Prefers the real Privy embedded-wallet address once the user has a Privy
 * session with a wallet; otherwise falls back to the mock address minted during
 * the local onboarding flow. This keeps the UI working today (mock signup) and
 * automatically upgrades to real on-chain addresses the moment Privy embedded
 * wallets are turned on (privy.ts → embeddedWallets.createOnLogin).
 */
export function useWalletIdentity() {
  const { authenticated, user: privyUser } = usePrivy()
  const { user } = useAuth()

  const privyAddress = authenticated ? privyUser?.wallet?.address : undefined
  const address = privyAddress ?? user?.wallet?.address ?? null

  return {
    address,
    network: user?.wallet?.network ?? WALLET_NETWORK,
    asset: WALLET_ASSET,
    /** 'privy' = real embedded wallet, 'mock' = local prototype wallet. */
    source: privyAddress ? ('privy' as const) : ('mock' as const),
  }
}
