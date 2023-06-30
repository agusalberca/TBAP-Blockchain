// scripts/index.js
const { getEnvVariable } = require("./helpers");

async function main () {
    // Our code will go here
    const accounts = await ethers.provider.listAccounts();
    console.log(`Deployer account: ${accounts[0]}`);
    const ContractFactory = await ethers.getContractFactory('RewardToken');
    console.log('Deploying Contract...');
    const contract = await ContractFactory.deploy(
        getEnvVariable("SIGNER_ADDRESS"), getEnvVariable("BACKEND_BASE_URI")
    );
    await contract.deployed();
    console.log('Contract deployed to:', contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });