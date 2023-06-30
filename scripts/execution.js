const { task } = require("hardhat/config");
const { getContract, getEnvVariable, getNetwork } = require("./helpers");

task("get-user-rewards", "Mints from the NFT contract")
.addParam("address", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.setAction(async function (taskArguments, hre) {
    const contract = await getContract("RewardToken", hre);
    // const contract = await hre.ethers.getContractAt("RewardToken", 
    //     getEnvVariable("NFT_CONTRACT_ADDRESS"));
    const Response = await contract.getUserRewards(taskArguments.address);
    console.log(`Response: ${Response}`);
});

task("test-get-contract", "tests net")
.setAction(async function (taskArguments, hre) {
    const contract = getContract("RewardToken", hre)
    console.log(`Contract address: ${contract.address}`);
});

task("test-get-network", "tests net")
.setAction(async function (taskArguments, hre) {
    console.log(`NETWORK: ${await getNetwork()}`);
});

