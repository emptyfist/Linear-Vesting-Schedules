// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LinearVesting is Ownable, ReentrancyGuard {
  using SafeMath for uint256;

  mapping (uint256 => uint256) private _starts;
  mapping (uint256 => uint256) private _redeemeds;
  mapping (uint256 => uint256) private _durations;
  mapping (uint256 => uint256) private _totalBalances;
  mapping (uint256 => address) private _benficiaries;
  mapping (uint256 => address) private _vestTokenAddrs;
  uint256 private curScheduleID = 0;

  function beneficiary(uint256 scheduleID) public view returns (address) {
    return _benficiaries[scheduleID];
  }

  function start(uint256 scheduleID) public view returns (uint256) {
    return _starts[scheduleID];
  }

  function duration(uint256 scheduleID) public view returns (uint256) {
    return _durations[scheduleID];
  }

  function redeemed(uint256 scheduleID) public view returns (uint256) {
    return _redeemeds[scheduleID];
  }

  function getCurScheduleID() public view returns (uint256) {
    return curScheduleID;
  }

  function getLastScheduleID() public view returns (uint256) {
    return curScheduleID == 0 ? 0 : curScheduleID - 1;
  }

  function redeem(uint256 scheduleID) public {
    uint256 unredeemed = _redeemableAmount(scheduleID);
    require(unredeemed > 0, "LinearVesting: no amount are due");
    _redeemeds[scheduleID] = _redeemeds[scheduleID].add(unredeemed);

    IERC20 token = IERC20(_vestTokenAddrs[scheduleID]);
    token.transfer(_benficiaries[scheduleID], unredeemed);
  }

  function _redeemableAmount(uint256 scheduleID) private view returns (uint256) {
    return _vestedAmount(scheduleID).sub(_redeemeds[scheduleID]);
  }

  function _vestedAmount(uint256 scheduleID) private view returns (uint256) {
    uint256 totalBalance = _totalBalances[scheduleID];

    if (block.timestamp >= _starts[scheduleID].add(_durations[scheduleID])) {
        return totalBalance;
    } else {
        return totalBalance.mul(block.timestamp.sub(_starts[scheduleID])).div(_durations[scheduleID]);
    }
  }

  function mint(address tokenAddr, address toAddr, uint256 time) public nonReentrant {
    require (tokenAddr != address(0), "LinearVesting: tokenAddress can't be zero.");
    require (toAddr != address(0), "LinearVesting: to address can't be zero.");
    require (time > 0, "LinearVesting: Vesting duration time must be bigger than zero.");
    IERC20 token = IERC20(tokenAddr);
    uint256 balance = token.balanceOf(_msgSender());
    uint256 recipientBalance = token.balanceOf(address(this));  // beneficiary's balance before received.
    require (balance > 0, "LinearVesting: Vesting amount must be bigger than zero.");

    token.transferFrom(_msgSender(), address(this), balance);
    
    uint256 transferedAmount = token.balanceOf(address(this)) - recipientBalance; // real amount that beneficiary is received.
    _totalBalances[curScheduleID] = transferedAmount;
    _starts[curScheduleID] = block.timestamp;
    _durations[curScheduleID] = time;
    _benficiaries[curScheduleID] = toAddr;
    _vestTokenAddrs[curScheduleID] = tokenAddr;
    curScheduleID ++;
  } 

}
