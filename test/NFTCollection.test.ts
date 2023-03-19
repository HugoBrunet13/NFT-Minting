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

  describe('Function MintNFT()', () => {

    it('Failure - Should fail to mint if wallet already minted one token', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));

      await NFTCollection.connect(USER1).mintNFT(
        "My NFT",
        "Description of NFT",
        "https://example.com/nft.png"
      );

      await expect(NFTCollection.connect(USER1).mintNFT(
        "My NFT 2",
        "Description of NFT2",
        "https://example.com/nft.png"
      )).to.be.revertedWith("You have already minted an NFT")

    });

    it('Failure - Should fail to mint if all all NFT are already minted', async () => {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1, USER2, USER3, USER4, USER5, USER6 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
      const users = [USER1, USER2, USER3, USER4, USER5, USER6]
      for (let i = 0; i < 5; i++) {
        await NFTCollection.connect(users[i]).mintNFT(
          `My NFT ${i}`,
          `This is my NFT number ${i}`,
          `https://example.com/nft${i}.png`
        );
      }

      await expect(
        NFTCollection.connect(USER6).mintNFT(
          "My NFT 6",
          "This is NFT 6",
          "https://example.com/nft.png"
        )
      ).to.be.revertedWith("All NFTs have been minted");
    });


    it("Success - Should mint an NFT successfully", async function () {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));

      await NFTCollection.connect(USER1).mintNFT(
        "My NFT",
        "Description of NFT",
        "https://example.com/nft.png"
      );

      const owner = await NFTCollection.ownerOf(1);
      expect(owner).to.equal(await USER1.getAddress());

      const metadata = await NFTCollection.tokenURI(1);
      expect(metadata).to.equal(
        '{"name": "My NFT", "description": "Description of NFT", "image": "https://example.com/nft.png"}'
      );
    });

    it("Failure - Should fail when time minting time windows is over", async function () {
      const startTime = await time.latest()
      const endTime = startTime + 10000
      const { NFTCollection, USER1 } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));

     await time.increase(endTime+10000)
    
      await expect(
        NFTCollection.connect(USER1).mintNFT(
          "My NFT",
          "This is my first NFT",
          "https://example.com/nft.png"
        )
      ).to.be.revertedWith("Minting window has closed");
    });


  });

});
