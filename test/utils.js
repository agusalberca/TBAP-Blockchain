
async function deployContract(deployerAccount, signerAddress, baseUri){
    const tokenFactory = await hre.ethers.getContractFactory('RewardToken');
    return await tokenFactory.connect(deployerAccount).deploy(signerAddress, baseUri);
}

async function signMessageData(tokenData, contractAddress){  
    const message = ethers.utils.solidityKeccak256(
      [ "string", "uint16", "uint256", "string", "address" ], 
      [ tokenData.title, tokenData.issuerId, tokenData.nonce, tokenData.uri, contractAddress ]);
    return await signer.signMessage(ethers.utils.arrayify(message));
};

module.exports = {
    deployContract,
    signMessageData
}