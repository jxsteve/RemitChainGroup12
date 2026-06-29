const hre = require('hardhat')

/**
 * Deploys MockUSDC + RemitChain to the selected network and (optionally) mints
 * test USDC to FUND_ADDRESS. Prints the values to put in the frontend .env.
 */
async function main() {
  const { ethers } = hre
  const [deployer] = await ethers.getSigners()
  if (!deployer) {
    throw new Error('No deployer account. Set PRIVATE_KEY in contracts/.env')
  }

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Network :', hre.network.name)
  console.log('Deployer:', deployer.address)
  console.log('Balance :', ethers.formatEther(balance), 'CELO\n')

  if (balance === 0n) {
    throw new Error('Deployer has 0 CELO — fund it from https://faucet.celo.org first.')
  }

  // 1) Test USDC (skip by setting USDC_ADDRESS to use an existing token).
  let usdcAddress = process.env.USDC_ADDRESS
  if (!usdcAddress) {
    const MockUSDC = await ethers.getContractFactory('MockUSDC')
    const usdc = await MockUSDC.deploy()
    await usdc.waitForDeployment()
    usdcAddress = await usdc.getAddress()
    console.log('MockUSDC   :', usdcAddress)
  } else {
    console.log('USDC (env) :', usdcAddress)
  }

  // 2) RemitChain bound to that USDC.
  const RemitChain = await ethers.getContractFactory('RemitChain')
  const remit = await RemitChain.deploy(usdcAddress)
  await remit.waitForDeployment()
  const remitAddress = await remit.getAddress()
  console.log('RemitChain :', remitAddress)

  // 3) Optionally fund a wallet with test USDC (only works on MockUSDC).
  const fund = process.env.FUND_ADDRESS
  if (fund && !process.env.USDC_ADDRESS) {
    const usdc = await ethers.getContractAt('MockUSDC', usdcAddress)
    const amount = 5000n * 10n ** 6n // 5,000 test USDC
    const tx = await usdc.mint(fund, amount)
    await tx.wait()
    console.log(`\nMinted 5,000 test USDC to ${fund}`)
  }

  console.log('\n--- Put this in the frontend env (root .env / Netlify) ---')
  console.log('VITE_REMITCHAIN_CONTRACT=' + remitAddress)
  console.log('VITE_CELO_MAINNET=' + (hre.network.name === 'celo'))
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
