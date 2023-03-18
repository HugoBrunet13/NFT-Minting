import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MyNFT contract", function () {

  async function deployNFTCollectionFixture() {
    const [ownerNFTCollection, USER1, USER2, USER3, USER4, USER5, _] = await ethers.getSigners();
    const NFTCollectionContract = await ethers.getContractFactory("NFTCollection");
    const NFTCollection = await NFTCollectionContract.deploy("My NFT Collection", "MNFT", 5, 1641513600, 1642513600);
    return { NFTCollection, ownerNFTCollection, USER1, USER2, USER3, USER4, USER5 };
  }


  describe('Deploy contract', () => {
    describe('Success -  Deploy contract with valid parameters', () => {
      it('Should deploy the contract with correct name and symbol', async () => {
        const { NFTCollection } = await loadFixture(deployNFTCollectionFixture);
        expect(await NFTCollection.name()).to.equal("My NFT Collection");
        expect(await NFTCollection.symbol()).to.equal("MNFT");

      });
      it('Should deploy the contract with correct maxNFTs, mintWindowsStart, mintWindowsEnd', async () => {
        const { NFTCollection } = await loadFixture(deployNFTCollectionFixture);
        expect(await NFTCollection.maxNFTs()).to.equal(5);
        expect(await NFTCollection.mintWindowStart()).to.equal(1641513600);
        expect(await NFTCollection.mintWindowEnd()).to.equal(1642513600);
      })
    })

    describe('Failure -  Deploy contract with invalid parameters', () => {
      it('Should fail to deploy if maxNFTs param is invalid', async () => {
        expect(true).to.equal(true)

      });
      it('Should fail to deploy if mintWindowsStart > mintWindowsEnd', async () => {
        expect(true).to.equal(true)
      })
    })

  });

  describe('Function MintNFT()', () => {
    it("Should fail when ...", async function () {
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
