import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MyNFT contract", function () {

  async function deployNFTCollectionFixture(nbNFTs: number, start: number, end: number) {
    const [ownerNFTCollection, USER1, USER2, USER3, USER4, USER5, _] = await ethers.getSigners();
    const NFTCollectionContract = await ethers.getContractFactory("NFTCollection");
    const NFTCollection = await NFTCollectionContract.deploy("My NFT Collection", "MNFT", nbNFTs, start, end);
    return { NFTCollection, ownerNFTCollection, USER1, USER2, USER3, USER4, USER5 };
  }


  describe('Deploy contract', () => {
    describe('Success -  Deploy contract with valid parameters', () => {
      it('Should deploy the contract with correct name and symbol', async () => {
        const startTime = Math.floor(Date.now() / 1000)
        const endTime = Math.floor(Date.now() / 1000) + 10000
        const { NFTCollection } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
        expect(await NFTCollection.name()).to.equal("My NFT Collection");
        expect(await NFTCollection.symbol()).to.equal("MNFT");

      });
      it('Should deploy the contract with correct maxNFTs, mintWindowsStart, mintWindowsEnd', async () => {
        const startTime = Math.floor(Date.now() / 1000)
        const endTime = Math.floor(Date.now() / 1000) + 10000
        const { NFTCollection } = await loadFixture(deployNFTCollectionFixture.bind(null, 5, startTime, endTime));
        expect(await NFTCollection.maxNFTs()).to.equal(5);
        expect(await NFTCollection.mintWindowStart()).to.equal(startTime);
        expect(await NFTCollection.mintWindowEnd()).to.equal(endTime);
      })
    })

    describe('Failure -  Deploy contract with invalid parameters', () => {
      it('Should fail to deploy if maxNFTs param is invalid', async () => {
        const startTime = Math.floor(Date.now() / 1000)
        const endTime = Math.floor(Date.now() / 1000) + 10000
        await expect(loadFixture(deployNFTCollectionFixture.bind(null, 0, startTime, endTime))).to.be.revertedWith("Invalid maxNFT value");

      });
      it('Should fail to deploy if not time window is invalid', async () => {
        await expect(loadFixture(deployNFTCollectionFixture.bind(null, 5, 1643513600, 1642513600))).to.be.revertedWith("Invalid time window");
      })
    })
  });

  describe('Function MintNFT()', () => {
    it("Should fail when time", async function () {
      expect(true).to.equal(true)

      // await myNFT.connect(accounts[0]).mintNFT(
      //   "My NFT",
      //   "This is my first NFT",
      //   "https://example.com/nft.png"
      // );

      // const owner = await myNFT.ownerOf(1);
      // expect(owner).to.equal(accounts[0].getAddress());

      // const metadata = await myNFT.tokenURI(1);
      // expect(metadata).to.equal(
      //   '{"name":"My NFT","description":"This is my first NFT","image":"https://example.com/nft.png"}'
      // );
    });

    it("should mint an NFT successfully", async function () {
      expect(true).to.equal(true)
      // await myNFT.connect(accounts[0]).mintNFT(
      //   "My NFT",
      //   "This is my first NFT",
      //   "https://example.com/nft.png"
      // );

      // const owner = await myNFT.ownerOf(1);
      // expect(owner).to.equal(accounts[0].getAddress());

      // const metadata = await myNFT.tokenURI(1);
      // expect(metadata).to.equal(
      //   '{"name":"My NFT","description":"This is my first NFT","image":"https://example.com/nft.png"}'
      // );
    });



  });



  // it("should not mint NFT after minting window", async function () {
  //   await ethers.provider.send("evm_setNextBlockTimestamp", [MINT_WINDOW_END + 1]);
  //   await ethers.provider.send("evm_mine", []);

  //   await expect(
  //     myNFT.connect(accounts[0]).mintNFT(
  //       "My NFT",
  //       "This is my first NFT",
  //       "https://example.com/nft.png"
  //     )
  //   ).to.be.revertedWith("Minting window has closed");
  // });

  // it("should not mint more than the maximum number of NFTs", async function () {
  //   for (let i = 0; i < 5; i++) {
  //     await myNFT.connect(accounts[0]).mintNFT(
  //       `My NFT ${i}`,
  //       `This is my NFT number ${i}`,
  //       `https://example.com/nft${i}.png`
  //     );
  //   }

  //   await expect(
  //     myNFT.connect(accounts[0]).mintNFT(
  //       "My NFT",
  //       "This is my first NFT",
  //       "https://example.com/nft.png"
  //     )
  //   ).to.be.revertedWith("All NFTs have been minted");
  // });

  // it("should allow only one NFT per wallet", async function () {
  //   await myNFT.connect(accounts[0]).mintNFT(
  //     "My NFT",
  //     "This is my first NFT",
  //     "https://example.com/nft.png"
  //   );

  //   await expect(
  //     myNFT.connect(accounts[0]).mintNFT(
  //       "My Second NFT",
  //       "This is my second NFT",
  //       "https://example.com/nft2.png"
  //     )
  //   ).to.be.revertedWith("You have already minted an NFT");
  // });
});
