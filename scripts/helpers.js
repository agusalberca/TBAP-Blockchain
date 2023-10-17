const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");


// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (!defaultValue) {
        throw `${key} is not defined and no default value was provided`;
    }
    return defaultValue;
}


// Helper method for getting network data
function getNetwork() {
    return ethers.providers.getNetwork(getEnvVariable("NETWORK", "homestead"));
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
    const network = getEnvVariable("NETWORK", "homestead");
    if (network === "homestead") {
        return hre.ethers.getDefaultProvider();
    }
    else{
        return new ethers.providers.EtherscanProvider(network , getEnvVariable("POLYGONSCAN_API_KEY"))
    }
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getDeployerAccount() {
    return new ethers.Wallet(getEnvVariable("DEPLOYER_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getSignerAccount() {
    return new ethers.Wallet(getEnvVariable("SIGNER_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getTesterAccount() {
    return new ethers.Wallet(getEnvVariable("TEST_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a contract instance at a given address
function getContract(contractName, hre) {
    // const account = getDeployerAccount();
    return getContractAt(hre, contractName, getEnvVariable("NFT_CONTRACT_ADDRESS"));
}

function signMintData(tokenData){
    const account = getSignerAccount();
    const message = ethers.utils.solidityKeccak256(
        [ "string", "uint16", "uint256", "string", "address" ], 
        [ tokenData.title, tokenData.issuerId, tokenData.nonce, tokenData.uri, getEnvVariable("NFT_CONTRACT_ADDRESS") ]);
    return account.signMessage(ethers.utils.arrayify(message));
}

function print_transaction(txResponse){
    console.log(`Transaction hash: ${txResponse.hash}`);
    console.log(`Transaction confirmed: ${txResponse.confirmations}`);
    console.log(`Transaction from: ${txResponse.from}`);
    console.log(`Transaction to: ${txResponse.to}`);
    console.log(`Transaction value: ${txResponse.value}`);
    console.log(`Transaction gasPrice: ${txResponse.gasPrice}`);
    console.log(`Transaction gasLimit: ${txResponse.gasLimit}`);
    console.log(`Transaction blockNumber: ${txResponse.blockNumber}`);
    console.log(`Transaction blockHash: ${txResponse.blockHash}`);
}

module.exports = {
    getEnvVariable,
    getProvider,
    getDeployerAccount,
    getTesterAccount,
    getContract,
    getNetwork,
    signMintData,
    print_transaction
}