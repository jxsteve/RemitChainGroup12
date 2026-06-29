// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RemitChain
 * @notice USDC-settled remittance contract for the RemitChain app.
 *
 * Implements the interface handed off to the frontend (src/lib/remitchainAbi.ts):
 * the sender approves USDC, then calls `sendMoney`; the contract pulls the gross
 * amount, sends the platform fee to `feeReceiver` and the remainder to the
 * receiver, records the transaction and emits `MoneySent`.
 */
contract RemitChain is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status {
        Pending,
        Completed,
        Cancelled
    }

    struct Transaction {
        uint256 id;
        address sender;
        address receiver;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
        string Paymentreference;
        Status status;
    }

    /// @notice The USDC token this contract settles in (set at deploy).
    IERC20 public usdc;
    /// @notice Address that receives platform fees.
    address public feeReceiver;
    /// @notice Platform fee in basis points (100 = 1%).
    uint256 public platformFee;
    /// @notice Total number of transactions recorded.
    uint256 public transactionCount;

    mapping(uint256 => Transaction) private _transactions;
    mapping(address => uint256[]) private _userTransactions;

    event MoneySent(
        uint256 indexed id,
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 fee,
        string Paymentreference,
        uint256 timestamp
    );
    event TransactionCancelled(uint256 indexed id);
    event PlatformFeeUpdated(uint256 newFee);
    event FeeReceiverUpdated(address receiver);

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "usdc=0");
        usdc = IERC20(_usdc);
        feeReceiver = msg.sender;
        platformFee = 100; // 1%
    }

    /**
     * @notice Send `amount` USDC to `receiver`, charging the platform fee.
     * @dev Requires the sender to have approved this contract for `amount`.
     *      `fee` is taken from `amount`; the receiver gets `amount - fee`.
     */
    function sendMoney(address receiver, uint256 amount, string calldata Paymentreference)
        external
        whenNotPaused
        nonReentrant
    {
        require(receiver != address(0), "receiver=0");
        require(amount > 0, "amount=0");

        uint256 fee = (amount * platformFee) / 10_000;
        uint256 payout = amount - fee;

        usdc.safeTransferFrom(msg.sender, address(this), amount);
        if (fee > 0) {
            usdc.safeTransfer(feeReceiver, fee);
        }
        usdc.safeTransfer(receiver, payout);

        uint256 id = transactionCount++;
        _transactions[id] = Transaction({
            id: id,
            sender: msg.sender,
            receiver: receiver,
            amount: amount,
            fee: fee,
            timestamp: block.timestamp,
            Paymentreference: Paymentreference,
            status: Status.Completed
        });
        _userTransactions[msg.sender].push(id);
        if (receiver != msg.sender) {
            _userTransactions[receiver].push(id);
        }

        emit MoneySent(id, msg.sender, receiver, amount, fee, Paymentreference, block.timestamp);
    }

    function getTransaction(uint256 id) external view returns (Transaction memory) {
        return _transactions[id];
    }

    function getUserTransactions(address user) external view returns (uint256[] memory) {
        return _userTransactions[user];
    }

    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "fee>10%");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function updateFeeReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "receiver=0");
        feeReceiver = newReceiver;
        emit FeeReceiverUpdated(newReceiver);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
