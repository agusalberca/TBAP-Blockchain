const { task } = require("hardhat/config");
const { getContract, getEnvVariable } = require("./helpers");

task("mint", "Mints from the NFT contract")
.addParam("address", "The address to receive a token")
.setAction(async function (taskArguments, hre) {
    const contract = await getContract("RewardToken", hre);
    const transactionResponse = await contract.mintTo(taskArguments.address, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("mint-gift", "Mints gifts from the NFT contract")
.addParam("beneficiary", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.addParam("title", "The title of the nft", "Test Title")
.addParam("issuerId", "The issuerId of the nft", "1")
.addParam("uri", "The uri of the nft", "1")
.setAction(async function (taskArguments, hre) {
    // const contract = await getContract("RewardToken", hre);
    const contract = await hre.ethers.getContractAt("RewardToken", getEnvVariable("NFT_CONTRACT_ADDRESS"))
    const transactionResponse = await contract.mintGift(taskArguments.beneficiary,
                                                        taskArguments.title, 
                                                        taskArguments.issuerId,
                                                        taskArguments.uri);
    console.log(`Transaction Hash: ${transactionResponse}`);
    // console.log(`Transaction Hash: ${transactionResponse.hash}`);
});