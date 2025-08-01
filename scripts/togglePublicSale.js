const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xF9fA957fC52D69ACED512Ad395B514F9e6539a83"; // ← deine Polygon-Adresse
  const FroggersNFT = await ethers.getContractFactory("FroggersNFT");
  const contract = await FroggersNFT.attach(contractAddress);

  const tx = await contract.togglePublicSale();
  await tx.wait();

  const publicStatus = await contract.publicSaleActive();
  const presaleStatus = await contract.presaleActive();

  console.log(`🚀 Public Sale aktiv: ${publicStatus}`);
  console.log(`🌿 Presale aktiv: ${presaleStatus}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});