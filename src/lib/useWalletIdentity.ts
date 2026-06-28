import { useAuth } from './auth'
import { useUserIdentity } from './useUserIdentity'
import { WALLET_ASSET, WALLET_NETWORK } from './wallet'

/**
 * Wallet-display view over the canonical identity (see useUserIdentity).
 *
 * Returns the address to show plus its network/asset. Address + source come
 * from the shared resolver so there is one source of truth; network is read
 * from the mock wallet (the real chain comes from Privy config once live).
 */
export function useWalletIdentity() {
  const { walletAddress, source } = useUserIdentity()
  const { user } = useAuth()

  return {
    address: walletAddress,
    network: user?.wallet?.network ?? WALLET_NETWORK,
    asset: WALLET_ASSET,
    /** 'privy' = real embedded wallet, 'mock' = local prototype, null = signed out. */
    source,
  }
}
