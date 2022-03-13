# Linear-Vesting-Schedules

## Description

Create a contract that allows anyone to create linear vesting schedules for any ERC20 tokens.

- Anyone can call mint(ERC20Token, to, amount, time) to create a linear vesting schedule
For example, a user calls mint("0xD533a949740bb3306d119CC777fa900bA034cd52", toAddr, 1e20, 1 year) on ethereum (the first param is CRV's token addie) would allow toAddr to redeem() 100 CRV tokens (CRV is 18 decimals) over a year. Of course whoever calls mint() needs to provide all the tokens first. The redeem() schedule is linear so that means at 1/4 year toAddr can redeem() 25 CRVs, at half year, toAddr can redeem up to 50 CRV. There's also no cliff so toAddr can start redeeming CRV tokens as soon as they receives it. It's just the amount they can redeem would be small.
- Redeem(uint scheduleId) to redeem the token. Note it's not redeem(address ERC20Token) because each token could have a million different schedules configures. So a user is redeeming from that one particular schedule, which should already implied the token address. Also it should redeem all of the tokens available for redemption for an easy user experience.
- Please use github private repo to track your work and share with @renruyi on github. How you organize your repo. How you commit and push is also part of the evaluation.
- As simple as this contract sounds, there are a few pitfalls. When reviewing, we will be looking at how you handle these potential issues. As you know, security is out top concern.

## Install && Test

- Build Project
```
npx hardhat compile
```

- Test Project
```
npx hardhat test
```

- Clean Project
```
npx hardhat clean
```

- Deploy
```
npx hardhat run scripts/deploy.js --network ropsten.
```
