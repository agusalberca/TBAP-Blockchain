/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
// require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-waffle");
require("./scripts/deploy.js");
require("./scripts/mint.js");
require("./scripts/execution.js");


const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.18",
   loggingEnabled: true,
   networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
  }
}