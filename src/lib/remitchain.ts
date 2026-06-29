import { useCallback } from 'react'
import { useWallets } from '@privy-io/react-auth'
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  erc20Abi,
  isAddress,
  parseUnits,
  formatUnits,
  type Address,
} from 'viem'
import { remitChainAbi } from './remitchainAbi'
import { REMITCHAIN_CHAIN } from './privy'

/**
 * On-chain client for the RemitChain contract (Celo, USDC-settled).
 *
 * Adheres to the Web3 team's ABI (src/lib/remitchainAbi.ts):
 *   sendMoney(receiver, amount, paymentReference)  — pulls USDC via transferFrom,
 *   so the sender must first approve() the contract for `amount`.
 *
 * The contract address is supplied via VITE_REMITCHAIN_CONTRACT. When it is not
 * set (or invalid) the app stays in mock mode and `isOnChainConfigured` is false,
 * so the prototype keeps working without a deployment.
 */

const RAW_CONTRACT = import.meta.env.VITE_REMITCHAIN_CONTRACT as string | undefined

export const REMITCHAIN_CONTRACT: Address | null =
  RAW_CONTRACT && isAddress(RAW_CONTRACT) ? (RAW_CONTRACT as Address) : null

/** True once a valid contract address is configured. */
export const isOnChainConfigured = REMITCHAIN_CONTRACT !== null

/** USDC uses 6 decimals on Celo (and most chains). */
const USDC_DECIMALS = 6

/** Read-only client against the configured Celo network (uses viem's default RPC). */
export const publicClient = createPublicClient({
  chain: REMITCHAIN_CHAIN,
  transport: http(),
})

export interface SendMoneyParams {
  /** Recipient EVM address. */
  to: Address
  /** Amount in whole USDC (e.g. 66.67), encoded to 6 decimals on-chain. */
  amountUsdc: number
  /** Human-facing payment reference stored on-chain + emitted in MoneySent. */
  reference: string
}

export interface SendMoneyResult {
  /** sendMoney transaction hash. */
  hash: `0x${string}`
  /** Approval transaction hash, if an approval was needed. */
  approvalHash?: `0x${string}`
}

/**
 * Hook exposing the contract actions, signed by the user's Privy embedded wallet.
 */
export function useRemitChain() {
  const { wallets } = useWallets()
  // Prefer the Privy-managed embedded wallet; fall back to the first connected one.
  const wallet = wallets.find((w) => w.walletClientType === 'privy') ?? wallets[0]

  const ready = isOnChainConfigured && Boolean(wallet)

  /** Build a viem wallet client bound to the embedded wallet on the Celo chain. */
  const getWalletClient = useCallback(async () => {
    if (!wallet) throw new Error('No wallet available. Sign in first.')
    // Ensure the wallet is on the RemitChain chain before signing.
    try {
      await wallet.switchChain(REMITCHAIN_CHAIN.id)
    } catch {
      /* some wallets auto-switch / already on chain */
    }
    const provider = await wallet.getEthereumProvider()
    return createWalletClient({
      account: wallet.address as Address,
      chain: REMITCHAIN_CHAIN,
      transport: custom(provider),
    })
  }, [wallet])

  /** Read the USDC token the contract was deployed against (authoritative). */
  const getUsdcAddress = useCallback(async (): Promise<Address> => {
    if (!REMITCHAIN_CONTRACT) throw new Error('Contract address not configured.')
    return publicClient.readContract({
      address: REMITCHAIN_CONTRACT,
      abi: remitChainAbi,
      functionName: 'usdc',
    }) as Promise<Address>
  }, [])

  /** USDC balance (whole units) for an address. */
  const getUsdcBalance = useCallback(
    async (owner: Address): Promise<number> => {
      const usdc = await getUsdcAddress()
      const raw = (await publicClient.readContract({
        address: usdc,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [owner],
      })) as bigint
      return Number(formatUnits(raw, USDC_DECIMALS))
    },
    [getUsdcAddress],
  )

  /**
   * approve (if needed) → sendMoney. Waits for each receipt and returns hashes.
   */
  const sendMoney = useCallback(
    async ({ to, amountUsdc, reference }: SendMoneyParams): Promise<SendMoneyResult> => {
      if (!REMITCHAIN_CONTRACT) throw new Error('Contract address not configured.')
      if (!isAddress(to)) throw new Error('Recipient is not a valid wallet address.')
      if (!wallet) throw new Error('No wallet available. Sign in first.')

      const account = wallet.address as Address
      const amount = parseUnits(amountUsdc.toString(), USDC_DECIMALS)
      const walletClient = await getWalletClient()
      const usdc = await getUsdcAddress()

      // 1) Ensure the contract is allowed to pull `amount` USDC from the sender.
      const allowance = (await publicClient.readContract({
        address: usdc,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account, REMITCHAIN_CONTRACT],
      })) as bigint

      let approvalHash: `0x${string}` | undefined
      if (allowance < amount) {
        approvalHash = await walletClient.writeContract({
          address: usdc,
          abi: erc20Abi,
          functionName: 'approve',
          args: [REMITCHAIN_CONTRACT, amount],
          account,
          chain: REMITCHAIN_CHAIN,
        })
        await publicClient.waitForTransactionReceipt({ hash: approvalHash })
      }

      // 2) Execute the transfer on the RemitChain contract.
      const hash = await walletClient.writeContract({
        address: REMITCHAIN_CONTRACT,
        abi: remitChainAbi,
        functionName: 'sendMoney',
        args: [to, amount, reference],
        account,
        chain: REMITCHAIN_CHAIN,
      })
      await publicClient.waitForTransactionReceipt({ hash })

      return { hash, approvalHash }
    },
    [wallet, getWalletClient, getUsdcAddress],
  )

  return {
    /** Contract address is configured AND a wallet is present. */
    ready,
    /** Contract address is configured (independent of wallet). */
    configured: isOnChainConfigured,
    /** The signer address, if any. */
    address: wallet?.address as Address | undefined,
    sendMoney,
    getUsdcBalance,
    getUsdcAddress,
  }
}
