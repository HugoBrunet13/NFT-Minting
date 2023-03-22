import { artifacts, ethers } from "hardhat";
import path from "path";
import { NFTCollection } from "../typechain-types";

async function main() {
  const startWindow = Math.round(Date.now() / 1000);
  const endWindow = startWindow + 10000
  const NFTCollectionContract = await ethers.getContractFactory("NFTCollection");


  const gasPrice = await NFTCollectionContract.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const estimatedGas = await NFTCollectionContract.signer.estimateGas(
    NFTCollectionContract.getDeployTransaction("NFT Collection", "MNFT", 5, startWindow, endWindow),
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await NFTCollectionContract.signer.getBalance();
  console.log(`Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`);
  console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`);

  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
      `Insufficient funds. Top up your account balance by ${ethers.utils.formatEther(
        deploymentPrice.sub(deployerBalance),
      )}`,
    );
  }
  const NFTCollection = await NFTCollectionContract.deploy("NFT Collection", "MNFT", 5, startWindow, endWindow);

  await NFTCollection.deployed();

  console.log(
    `NFT Collection deployed to ${NFTCollection.address}`
  );
  saveFrontendFiles(NFTCollection);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function saveFrontendFiles(NFTCollection: NFTCollection) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ NFTCollection: NFTCollection.address }, undefined, 2)
  );

  const NFTCollectionArtifact = artifacts.readArtifactSync("NFTCollection");

  fs.writeFileSync(
    path.join(contractsDir, "NFTCollection.json"),
    JSON.stringify(NFTCollectionArtifact, null, 2)
  );
}
