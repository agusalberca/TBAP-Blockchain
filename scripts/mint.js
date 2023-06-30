const { task } = require("hardhat/config");
const { getContract, getEnvVariable, getDeployerAccount, getTesterAccount, signMintData } = require("./helpers");

task("mint-gift", "Mints gifts from the NFT contract")
.addParam("beneficiary", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.addParam("title", "The title of the nft", "Test Title")
.addParam("issuerId", "The issuerId of the nft", "1")
.addParam("uri", "The uri of the nft", "1")
.setAction(async function (taskArguments, hre) {
    const contract = await getContract("RewardToken", hre);
    // const contract = await hre.ethers.getContractAt("RewardToken", 
    //     getEnvVariable("NFT_CONTRACT_ADDRESS"))
    const deployer = await getDeployerAccount();
    const txResponse = await contract.connect(deployer).mintGift(
        taskArguments.beneficiary,taskArguments.title, 
        taskArguments.issuerId,taskArguments.uri);
    console.log(`Response: ${txResponse}`);
});

task("mint", "Mints NFT for address")
.addParam("beneficiary", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.addParam("title", "The title of the nft", "Test Title")
.addParam("issuerId", "The issuerId of the nft", "1")
.addParam("uri", "The uri of the nft", "1")
.setAction(async function (taskArguments, hre) {
    const tokenData = {
        title: taskArguments.title, issuerId: taskArguments.issuerId, 
        nonce: 0, uri: taskArguments.uri
    }
    const contract = await getContract("RewardToken", hre);
    const testerAcc = await getTesterAccount()
    const signature = await signMintData(tokenData);
    const txResponse = await contract.connect(testerAcc).mint(
        tokenData.title, tokenData.issuerId,
        tokenData.nonce, tokenData.uri, signature);
    console.log(`Response: ${txResponse}`);
});