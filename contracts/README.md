# RemitChain contracts

Solidity implementation of the RemitChain remittance contract (matches the ABI
in `../src/lib/remitchainAbi.ts`) plus a 6-decimal `MockUSDC` for testnet, and a
one-command deploy to **Celo Alfajores**.

## Deploy in 3 steps

```bash
cd contracts
npm install

# 1) Make a throwaway testnet wallet, then fund its address:
npm run keygen
#    → copy PrivateKey into .env (PRIVATE_KEY=...)
#    → fund the Address with Alfajores CELO: https://faucet.celo.org
#    → (optional) set FUND_ADDRESS=<your Privy wallet> to receive test USDC

# 2) Deploy MockUSDC + RemitChain to Alfajores:
npm run deploy:alfajores
```

The script prints:

```
VITE_REMITCHAIN_CONTRACT=0x....   ← put this in the frontend env
VITE_CELO_MAINNET=false
```

## Wire it into the app

Add that line to the project root `.env` for local dev, and set the same var in
**Netlify → Site settings → Environment variables**, then redeploy. The transfer
flow will then settle on-chain via `sendMoney` instead of the mock.

## Notes
- `.env` is gitignored — never commit your private key.
- `sendMoney` pulls the gross `amount` (the app approves it first); the fee
  (`platformFee`, default 1%) is taken from it and the receiver gets the rest.
- For Celo **mainnet**, deploy against real USDC: set `USDC_ADDRESS` and run
  `npm run deploy:celo`.
