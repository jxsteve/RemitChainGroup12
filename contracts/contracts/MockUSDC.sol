// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice 6-decimal test stablecoin for the RemitChain testnet deployment.
 *         `mint` is intentionally open so you can fund test wallets freely.
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin (Test)", "USDC") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
