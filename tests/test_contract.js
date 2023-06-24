const hre = require("hardhat");
const { expect } = require("chai");
const utils = require('./utils.js');

//Global variables
let deployer, bob, alice;

describe("Unit test-all", function () {

    // redeploy on every test
    beforeEach(async function () {
        [deployer, signer, bob, alice] = await ethers.getSigners();
        //deploy NFT
        contract = await utils.deployContract(deployer, signer.address)
        expect(await contract.owner()).to.eq(deployer.address)
        // console.log(`Contract signer: ${await contract.signer()}`)
        // expect(await contract.signer().toString()).to.eq(signer.address)
    });

    it("Test mint gift ownership", async function () {
      const bobBalance = await contract.balanceOf(bob.address);
      expect(bobBalance.toString()).to.eq("0");

      // bob cant mint gift
      await expect(
        contract.connect(bob).mintGift(bob.address,"test title", 1, 1))
        .to.be.revertedWith("Ownable: caller is not the owner");
      
        //deployer can mint gift
      await contract.connect(deployer).mintGift(bob.address,"test title", 1, 1);
      expect(await contract.balanceOf(bob.address)).to.eq(1)
    });

    it("Test mint with ethers signature", async function () {  
      const message = ethers.utils.solidityKeccak256(
        [ "string", "uint16", "uint256", "string", "address" ], 
        [ "test", 1, 1, "1", contract.address ]);
      const signature = await signer.signMessage(ethers.utils.arrayify(message));

      // bob can mint
      await contract.connect(bob).mint("test", 1, 1, "1", signature);
      expect(await contract.balanceOf(bob.address)).to.eq(1)
    });

    it("Test mint burned nonce", async function () {  
      const message = ethers.utils.solidityKeccak256(
        [ "string", "uint16", "uint256", "string", "address" ], 
        [ "test", 1, 1, "1", contract.address ]);
      const signature = await signer.signMessage(ethers.utils.arrayify(message));

      // bob can mint
      await contract.connect(bob).mint("test", 1, 1, "1", signature);
      expect(await contract.balanceOf(bob.address)).to.eq(1)
      
      // bob can't mint
      expect(
        await contract.connect(bob).mint("test", 1, 1, "1", signature)
        ).to.be.revertedWith('Signature already used');
      expect(await contract.balanceOf(bob.address)).to.eq(1)
    });

    it("Test signature", async function () {
      //signature generation
      // const message_title = "test title"
      // const message = ethers.utils.solidityKeccak256(
      //   [ "string", "address" ],
      //   [ message_title, contract.address ]);
      // const messageHash = ethers.utils.arrayify(message);
      // const signature = await signer.signMessage(messageHash);

      //check signature signer inside test enviroment
      // expect(
      //   ethers.utils.verifyMessage(messageHash, signature)
      //   ).to.eq(signer.address);

      //check signature signer inside contract
      // expect(
      //   await contract.connect(bob).test_signature_string_get(message_title, signature)
      //   ).to.eq(signer.address);

      //check signature signer inside contract using hash data
      // await contract.connect(bob).test_signature_hash(messageHash, signature)

      // expect(
      //   await contract.connect(bob).test_signature_hash_get(messageHash, signature)
      //   ).to.eq(signer.address);
    });

});
  
// .to.be.revertedWith("You can't withdraw yet");

// Helpful links:
// Tests using chai: https://docs.openzeppelin.com/learn/writing-automated-tests#setting-up-a-testing-environment