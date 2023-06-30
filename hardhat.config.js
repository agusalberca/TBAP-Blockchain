/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");
require("./scripts/deploy.js");
require("./scripts/mint.js");
require("./scripts/execution.js");


const { POLYGONSCAN_API_KEY, DEPLOYER_PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.18",
  //  loggingEnabled: true,
   networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      },
    hardhat: {},
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [DEPLOYER_PRIVATE_KEY]
      }
    },
    etherscan: {
      apiKey: POLYGONSCAN_API_KEY
    },
}