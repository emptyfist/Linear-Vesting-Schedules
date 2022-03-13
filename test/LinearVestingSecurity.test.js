const { expect, assert } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('LinearVesting contract', function () {
  let linearVesting;
  let liteCoin;
  const time  = 10**3 * 60;  // 60 second

  before(async function () {
    linearVesting = await ethers.getContractFactory('LinearVesting');

    liteCoin = await ethers.getContractFactory('BEP20BitcoinCash');
    liteCoin = await liteCoin.deploy();
    await liteCoin.deployed();

    linearVesting = await linearVesting.deploy();
    await linearVesting.deployed();
  });
  
  describe('Security Test', function () {
    describe ('Reentrancy Test', function () {
      it ('mint() function reentrancy attack test', async function() {
        let isError = false;
        try {
          const [owner, addr1] = await ethers.getSigners();  
          const ownerBalance = await liteCoin.balanceOf(owner.address);
          await liteCoin.increaseAllowance(linearVesting.address, ownerBalance);
          linearVesting.mint(liteCoin.address, addr1.address, time);
          await linearVesting.mint(liteCoin.address, addr1.address, time);
        } catch (e) {
          isError = true;
        }
        assert.equal(isError, true);
      });
    });
  });
});