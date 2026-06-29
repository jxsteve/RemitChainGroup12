const { ethers } = require('ethers')

/** Generate a throwaway deployer keypair. Fund the ADDRESS from a faucet. */
const w = ethers.Wallet.createRandom()
console.log('\nThrowaway deployer wallet (TESTNET ONLY):\n')
console.log('Address    :', w.address)
console.log('PrivateKey :', w.privateKey)
console.log('\n1) Put PrivateKey in contracts/.env as PRIVATE_KEY=')
console.log('2) Fund the Address with Alfajores CELO: https://faucet.celo.org')
console.log('3) Run: npm run deploy:alfajores\n')
