const { expect, assert } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('LinearVesting contract', function () {
  let linearVesting;
  let liteCoin;
  let scheduleID;
  const time  = 10**3 * 60;  // 60 second

  before(async function () {
    linearVesting = await ethers.getContractFactory('LinearVesting');

    liteCoin = await ethers.getContractFactory('BEP20BitcoinCash');
    liteCoin = await liteCoin.deploy();
    await liteCoin.deployed();

    linearVesting = await linearVesting.deploy();
    await linearVesting.deployed();
  });
  
  describe('Check Mint function', function () {
    describe ('Call Mint function', function () {
      it ('Calling mint(tokenAddr, toAddr, time) should be succeed.', async function() {
        const [owner, addr1] = await ethers.getSigners();  
        const ownerBalance = await liteCoin.balanceOf(owner.address);
        await liteCoin.increaseAllowance(linearVesting.address, ownerBalance);
        await linearVesting.mint(liteCoin.address, addr1.address, time);
      });
  
      it ('If owner does not have token balance, mint function should be failed', async function() {
        let isError = false;
        try {
          await linearVesting.mint(linteCoin.address, addr1.address, time);
        } catch(e) {
          isError = true;
        }
        assert.equal(isError, true);
      });

      it ('Double Minting should be faile', async function() {
        let isError = false;
        try {
          linearVesting.mint(linteCoin.address, addr1.address, time);
          linearVesting.mint(linteCoin.address, addr1.address, time);
        } catch (e) {
          isError = true;
        }
        assert.equal(isError, true);
      });

      it ('Mint function that has exceed amoutn should be failed', async function() {
        let isError = false;
        try {
          const balance = linteCoin.balanceOf()
        } catch (e) {
          isError = true;
        }
        assert.equal(isError, true);
      });
    });

    describe ('After mint, param checking', function () {
      it ('Last ScheduleID should be zero', async function () {
        scheduleID = await linearVesting.getLastScheduleID();
        assert.equal(scheduleID, 0);
      });

      it ('Duration should be 60 seconds', async function () {
        assert.equal(await linearVesting.duration(scheduleID), time);
      });

      it ('Beneficiary address should be second owner address', async function () {
        const [owner, addr1] = await ethers.getSigners();    
        assert.equal(await linearVesting.beneficiary(scheduleID), addr1.address);
      });

      it ('First owner address should be has zero balance.', async function () {
        const [owner, addr1] = await ethers.getSigners();    
        assert.equal(await liteCoin.balanceOf(owner.address), 0);
      });

      it ('Beneficiary address should be has first Owner origin balance.', async function () {
        const [owner, addr1] = await ethers.getSigners();    
        const toBalance = await liteCoin.balanceOf(addr1.address);
        const ownerBalance = await liteCoin.balanceOf(owner.address);
        assert.equal(toBalance.eq(ethers.BigNumber.from(ownerBalance)), true);
      });
    });
  });

  describe ('Check redeem function', function () {
    it ('Redeem amount should be bigger than zero.', async function() {
      const [owner, addr1] = await ethers.getSigners();    
      await linearVesting.redeem(scheduleID);
      const balance = await liteCoin.balanceOf(addr1.address);
      assert.equal(balance > 0, true);
    })
  });

});