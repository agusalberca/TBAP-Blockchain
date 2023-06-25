const hre = require("hardhat");
const { expect } = require("chai");
const utils = require('./utils.js');

//Global variables
let deployer, bob, alice;
const baseUri = "http://mybackendtestutl.com/api/token/";
describe("Contract Unit tests", function () {
    // redeploy on every test
    beforeEach(async function () {
        // const signers = await hre.ethers.getSigners();
        [deployer, signer, bob, alice] = await ethers.getSigners();
        //deploy NFT
        contract = await utils.deployContract(
          deployer, signer.address, baseUri);
        expect(await contract.owner()).to.eq(deployer.address)
    });

    describe("Mint tests", function () {
      it("Test mintGift function ownership", async function () {
        const bobBalance = await contract.balanceOf(bob.address);
        expect(bobBalance.toString()).to.eq("0");

        const tokenData = {
          address: bob.address, title: "test title", 
          issuerId: 1, uri: "1"
        }
        //bob cant mint gift
        await expect(
          contract.connect(bob).mintGift(
            tokenData.address, tokenData.title,
            tokenData.issuerId, tokenData.uri
          ))
          .to.be.revertedWith("Ownable: caller is not the owner");
        
        //deployer can mint gift
        await contract.connect(deployer).mintGift(
          tokenData.address, tokenData.title,
          tokenData.issuerId, tokenData.uri
        );
        expect(await contract.balanceOf(bob.address)).to.eq(1)
      });

      it("Test mint with ethers signature", async function () { 
        const tokenData = {
          title: "test", issuerId: 1,
          nonce: 1, uri: "1"
        }
        const signature = utils.signMessageData(tokenData, contract.address); 

        // bob can mint
        await contract.connect(bob).mint(
          tokenData.title,tokenData.issuerId,
          tokenData.nonce,tokenData.uri,signature);
        expect(await contract.balanceOf(bob.address)).to.eq(1)
      });

      it("Test mint used nonce", async function () {  
        const tokenData = {
          title: "test", issuerId: 1,
          nonce: 1, uri: "1"
        }
        const signature = utils.signMessageData(tokenData, contract.address);
        // bob can mint with nonce 1
        await contract.connect(bob).mint(
          tokenData.title, tokenData.issuerId,
          tokenData.nonce,tokenData.uri,signature);
        expect(await contract.balanceOf(bob.address)).to.eq(1)
        
        // bob can't mint with nonce 1 again
        await expect(
          contract.connect(bob).mint(
            tokenData.title,tokenData.issuerId,
            tokenData.nonce,tokenData.uri,signature))
          .to.be.revertedWith('Signature already used');
        expect(await contract.balanceOf(bob.address)).to.eq(1)
      });
    });

    describe("Transfer tests", function () {
      it("Test deny transfership", async function () {
        const tokenData = {
          address: bob.address, title: "test title", 
          issuerId: 1, uri: "1"
        }
        await contract.connect(deployer).mintGift(
          tokenData.address, tokenData.title,
          tokenData.issuerId, tokenData.uri
        );
        // bob can't transfer
        await expect(
          contract.connect(bob).transferFrom(
            bob.address, alice.address, 0))
          .to.be.revertedWith("Token ownership is non transferrable");
      });
    });

    describe("URI tests", function () {
      let tokenData= {}
      beforeEach(async function () {
        tokenData = {
          address: bob.address, title: "test title", 
          issuerId: 1, uri: "1"
        }
        await contract.connect(deployer).mintGift(
          tokenData.address, tokenData.title,
          tokenData.issuerId, tokenData.uri
        );
      });
      it("Test existent token URI", async function () {
        // bob can't transfer
        // console.log(`Token Uri: ${await contract.tokenURI(0)}`)
        expect(
          await contract.tokenURI(0)).eq(`${baseUri}${tokenData.uri}`);
      });
      it("Test nonexistent token URI", async function () {
        await expect(
          contract.tokenURI(10000))
          .to.be.reverted;
      });
    });

    describe("Data validness tests", function () {
      
      it("Test deny blank title", async function () {
        const tokenData = {
          address: bob.address, title: "", 
          issuerId: 1, uri: "1"
        }
        await expect(
          contract.connect(deployer).mintGift(
            tokenData.address, tokenData.title, 
            tokenData.issuerId, tokenData.uri))
          .to.be.revertedWith("Title cannot be blank");
      });     

      it("Test deny title too long", async function () {
        const tokenData = {
          address: bob.address, title: "", 
          issuerId: 1, uri: "1"
        }
        tokenData.title = "a".repeat(257)
        // console.log(`Token title: ${tokenData.title.length}`)
        await expect(
          contract.connect(deployer).mintGift(
            tokenData.address, tokenData.title, 
            tokenData.issuerId, tokenData.uri))
          .to.be.revertedWith("Title is too long");
      });
    });
    
});
  

// Helpful links:
// Tests using chai: https://docs.openzeppelin.com/learn/writing-automated-tests#setting-up-a-testing-environment
// Hardhat Guide: How to Unit Test a Contract: https://www.chainshot.com/article/how-to-write-unit-tests