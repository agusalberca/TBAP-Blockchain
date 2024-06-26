const { task } = require("hardhat/config");
const { getContract, getEnvVariable, getDeployerAccount, getTesterAccount, signMintData, print_transaction } = require("./helpers");


task("mint-gift", "Mints gifts from the NFT contract")
.addParam("beneficiary", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.addParam("title", "The title of the nft", "Test Title")
.addParam("issuerId", "The issuerId of the nft", "0")
.addParam("uri", "The uri of the nft", "0")
.setAction(async function (taskArguments, hre) {
    const contract = await getContract("RewardToken", hre);
    // const contract = await hre.ethers.getContractAt("RewardToken", 
    //     getEnvVariable("NFT_CONTRACT_ADDRESS"))
    const deployer = await getDeployerAccount();
    const txResponse = await contract.connect(deployer).mintGift(
        taskArguments.beneficiary,taskArguments.title, 
        taskArguments.issuerId,taskArguments.uri);
    print_transaction(txResponse);
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
        print_transaction(txResponse);
});

task("get-signature", "Generates signature for minting NFT")
.addParam("beneficiary", "The address to receive a token", getEnvVariable("TEST_ADDRESS"))
.addParam("title", "The title of the nft", "Backend TEST")
.addParam("issuerId", "The issuerId of the nft", "1")
.addParam("uri", "The uri of the nft", "test_uri")
.setAction(async function (taskArguments, hre) {
    const tokenData = {
        title: taskArguments.title, issuerId: parseInt(taskArguments.issuerId), 
        nonce: 1, uri: taskArguments.uri
    }
    const contract = await getContract("RewardToken", hre);
    const testerAcc = await getTesterAccount()
    const signature = await signMintData(tokenData);
    console.log(`Signature: ${signature}`);
});