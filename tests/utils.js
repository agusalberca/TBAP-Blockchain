
async function deployContract(deployerAccount, signerAddress){
    const tokenFactory = await hre.ethers.getContractFactory('RewardToken');
    return await tokenFactory.connect(deployerAccount).deploy(signerAddress);
}

module.exports = {
    deployContract,
}