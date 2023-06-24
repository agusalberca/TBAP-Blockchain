const { task } = require("hardhat/config");
const { getContract, getEnvVariable } = require("./helpers");

task("getUserRewards", "Mints from the NFT contract")
.addParam("address", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.setAction(async function (taskArguments, hre) {
    // const contract = await getContract("RewardToken", hre);
    const contract = await hre.ethers.getContractAt("RewardToken", getEnvVariable("NFT_CONTRACT_ADDRESS"));
    const transactionResponse = await contract.getUserRewards(taskArguments.address);
    console.log(`Transaction Hash: ${transactionResponse}`);
});

task("test-get-contract", "tests net")
.setAction(async function (taskArguments, hre) {
    const contract = await hre.ethers.getContractAt("RewardToken", getEnvVariable("NFT_CONTRACT_ADDRESS"));
    console.log(`Contract address: ${contract.address}`);
});

