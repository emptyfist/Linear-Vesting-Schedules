/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
module.exports = {
  solidity: "0.8.0",
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.5.16",
      }
    ]
  }
};
