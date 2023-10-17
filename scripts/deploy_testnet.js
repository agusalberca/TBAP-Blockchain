// scripts/index.js
const { getEnvVariable } = require("./helpers");

async function main () {
    const accounts = await ethers.provider.listAccounts();
    const connected = await ethers.provider.getBlockNumber() !== null;
    console.log(`Provider connection: ${ connected }`);
    const gasPrice = await ethers.provider.getGasPrice();
    const increasedGasPrice = gasPrice.mul(500).div(100); // Increase by 10%
    console.log(`Gas price: ${ gasPrice.toString() }`);
    const ContractFactory = await ethers.getContractFactory('RewardToken');
    console.log(`Deployer account: ${ContractFactory.signer.address }`);
    const contract = await ContractFactory.deploy(
      getEnvVariable("SIGNER_ADDRESS"), getEnvVariable("BACKEND_BASE_URI"),
      { gasPrice: increasedGasPrice}
      );
    // console.log('Contract data: ', contract);
    console.log('Deploying Contract...');
    response = await contract.deployed();
    console.log('Response: ', response)
    console.log('Contract deployed to:', contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });