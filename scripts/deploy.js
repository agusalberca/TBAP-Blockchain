const { task } = require("hardhat/config");
const { getAccount, getEnvVariable } = require("./helpers");

// task("check-balance", "Prints out the balance of your account").setAction(async function (taskArguments, hre) {
//     const account = getAccount();
//     console.log(`Account balance for ${account.address}: ${await account.getBalance()}`);
// });

task("deploy", "Deploys the RewardToken.sol contract").setAction(async function (taskArguments, hre) {
    const nftContractFactory = await hre.ethers.getContractFactory("RewardToken", getAccount());
    const nft = await nftContractFactory.deploy(getEnvVariable("SIGNER_ADDRESS"));
    console.log(`Contract deployed to address: ${nft.address}`);
    
});

task("deploy-local", "Deploys the RewardToken.sol contract on local hardhat network")
    .setAction(async function (taskArguments, hre) 
    {
    //check account balance
    // const account = getAccount();
    // console.log(`Account balance for ${account.address}: ${await account.getBalance()}`);
    //get signers
    const signers = await hre.ethers.getSigners();
    console.log(`SIGNERS: ${signers[0].address }`)
    //deploy contract
    const ContractFactory = await hre.ethers.getContractFactory("RewardToken");
    const contract = await ContractFactory.deploy(getEnvVariable("SIGNER_ADDRESS"));
    
    // const ContractFactory = await hre.ethers.getContractFactory("RewardToken", getAccount());
    // const contract = await ContractFactory.deploy(getEnvVariable("SIGNER_ADDRESS"));
    console.log(`Contract deployed to address: ${contract.address}`);
    //get contract owner
    console.log(`Contract owner: ${await contract.owner()}`);
    });

