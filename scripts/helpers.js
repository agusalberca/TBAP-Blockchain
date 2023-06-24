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
    return ethers.providers.getNetwork("homestead");
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
    return ethers.getDefaultProvider(getEnvVariable("NETWORK", "homestead"));
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
    return new ethers.Wallet(getEnvVariable("ACCOUNT_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a contract instance at a given address
function getContract(contractName, hre) {
    const account = getAccount();
    return getContractAt(hre, contractName, getEnvVariable("NFT_CONTRACT_ADDRESS"), account);
}

//Example of python code to sign a message
// need to migrate this code to javascript
// def create_mint_signature(title, issuerId, nonce, uri):
//     print(CONTRACT_ADDRESS)
//     sig = web3.Web3.solidity_keccak([ "string", "uint16", "uint256", "string", "address" ],
//                                 [ title, issuerId, nonce, uri, CONTRACT_ADDRESS])
//     message = encode_defunct(hexstr=sig.hex())           
//     signed_message = w3.eth.account.sign_message(message, SIGNER_WALLET_PRIV_KEY)
//     signature = web3.Web3.to_hex(signed_message.signature)
//     print(verify_message(message, signature, WALLET_PUB_ADDRESS))
//     return signature

// def create_test_signature(title):
//     sig = web3.Web3.solidity_keccak([ "uint16", "address" ],
//                                 [ title, CONTRACT_ADDRESS])
//     message = encode_defunct(hexstr=sig.hex())           
//     signed_message = w3.eth.account.sign_message(message, SIGNER_WALLET_PRIV_KEY)
//     signature = web3.Web3.to_hex(signed_message.signature)
//     print(verify_message(message, signature, WALLET_PUB_ADDRESS))
//     return signature

// def verify_message(message, signature, address):
//     return w3.eth.account.recover_message(message, signature=signature) == address


module.exports = {
    getEnvVariable,
    getProvider,
    getAccount,
    getContract,
    getNetwork
}