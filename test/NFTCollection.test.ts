import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNFT contract", function () {

  async function deployNFTCollectionFixture(nbNFTs: number, start: number, end: number) {
    const [ownerNFTCollection, USER1, USER2, USER3, USER4, USER5, USER6, _] = await ethers.getSigners();
    const NFTCollectionContract = await ethers.getContractFactory("NFTCollection");
    const NFTCollection = await NFTCollectionContract.deploy("My NFT Collection", "MNFT", nbNFTs, start, end);
    return { NFTCollection, ownerNFTCollection, USER1, USER2, USER3, USER4, USER5, USER6 };
  }


  describe('Deploy contract', () => {
    describe('Success -  Deploy contract with valid parameters', () => {
      it('Should deploy the contract with correct name and symbol', async () => {
        const startTime = await time.latest()
        const endTime = startTime + 10000
        const { NFTCollection } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
        expect(await NFTCollection.name()).to.equal("My NFT Collection");
        expect(await NFTCollection.symbol()).to.equal("MNFT");

      });
      it('Should deploy the contract with correct maxNFTs, mintWindowsStart, mintWindowsEnd', async () => {
        const startTime = await time.latest()
        const endTime = startTime + 10000
        const { NFTCollection } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
        expect(await NFTCollection.maxNFTs()).to.equal(5);
        expect(await NFTCollection.mintWindowStart()).to.equal(startTime);
        expect(await NFTCollection.mintWindowEnd()).to.equal(endTime);
      })
    })

    describe('Failure -  Deploy contract with invalid parameters', () => {
      it('Should fail to deploy if maxNFTs param is invalid', async () => {
        const startTime = await time.latest()
        const endTime = startTime + 10000
        await expect(loadFixture(deployNFTCollectionFixture.bind(null, 0, startTime, endTime))).to.be.revertedWith("Invalid maxNFT value");
      });
      it('Should fail to deploy if not time window is invalid', async () => {
        await expect(loadFixture(deployNFTCollectionFixture.bind(null, 5, 1643513600, 1642513600))).to.be.revertedWith("Invalid time window");
      })
    })
  });

  describe('Function getMyNFT()', () => {
    it('Success - Should retrieve the NFT ID of the owner of a NFT', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
      await NFTCollection.connect(USER1).mintNFT(
        "URL"
      );
      const nftID = await NFTCollection.connect(USER1).getMyNFT()
      expect(nftID.toNumber()).to.equal(1)
    })
    it('Failure - Should return 0 if user does not own any NFT', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1, USER2, } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
      await NFTCollection.connect(USER1).mintNFT("URLMFT1");
      const nftIDUser1 = await NFTCollection.connect(USER1).getMyNFT()
      const nftIDUser2 = await NFTCollection.connect(USER2).getMyNFT()
      expect(nftIDUser1.toNumber()).to.equal(1)
      expect(nftIDUser2.toNumber()).to.equal(0)
    })
  })

  describe('Function MintNFT()', () => {

    it('Failure - Should fail to mint if wallet already minted one token', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));

      await NFTCollection.connect(USER1).mintNFT(
        "URL"
      );

      await expect(NFTCollection.connect(USER1).mintNFT(
        "URL"
      )).to.be.revertedWith("You have already minted an NFT")

    });

    it('Failure - Should fail to mint if all all NFT are already minted', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1, USER2, USER3, USER4, USER5, USER6 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
      const users = [USER1, USER2, USER3, USER4, USER5, USER6]
      for (let i = 0; i < 5; i++) {
        await NFTCollection.connect(users[i]).mintNFT("URL");
      }

      await expect(
        NFTCollection.connect(USER6).mintNFT("URL")
      ).to.be.revertedWith("All NFTs have been minted");
    });


    it("Success - Should mint an NFT successfully", async function () {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));

      await NFTCollection.connect(USER1).mintNFT("URL");

      const owner = await NFTCollection.ownerOf(1);
      expect(owner).to.equal(await USER1.getAddress());

      const metadata = await NFTCollection.tokenURI(1);
      expect(metadata).to.equal("URL");
    });

    it("Failure - Should fail when time minting time windows is over", async function () {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));

      await time.increase(endTime + 10000)

      await expect(
        NFTCollection.connect(USER1).mintNFT("URL")
      ).to.be.revertedWith("Minting window has closed");
    });
  });

  describe('Function getCurrentToken()', () => {
    it('Success - Should return 0 is no token are minted', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
      const counter = await NFTCollection.connect(USER1).getCurrentToken()
      expect(counter.toNumber()).to.equal(0)
    })
    it('Success - Should return 2 if 2 tokens are minted', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1, USER2 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
      await NFTCollection.connect(USER1).mintNFT("URLMFT1");
      await NFTCollection.connect(USER2).mintNFT("URLMFT2");
      const counter = await NFTCollection.connect(USER1).getCurrentToken()
      expect(counter.toNumber()).to.equal(2)
    })
  })

});
