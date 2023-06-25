const { task } = require("hardhat/config");
const { getContract, getEnvVariable } = require("./helpers");

task("mint-gift", "Mints gifts from the NFT contract")
.addParam("beneficiary", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.addParam("title", "The title of the nft", "Test Title")
.addParam("issuerId", "The issuerId of the nft", "1")
.addParam("uri", "The uri of the nft", "1")
.setAction(async function (taskArguments, hre) {
    // const contract = await getContract("RewardToken", hre);
    const contract = await hre.ethers.getContractAt("RewardToken", 
        getEnvVariable("NFT_CONTRACT_ADDRESS"),getEnvVariable("BACKEND_BASE_URI"))
    const transactionResponse = await contract.mintGift(
        taskArguments.beneficiary,taskArguments.title, 
        taskArguments.issuerId,taskArguments.uri);
    console.log(`Transaction Hash: ${transactionResponse}`);
    // console.log(`Transaction Hash: ${transactionResponse.hash}`);
});