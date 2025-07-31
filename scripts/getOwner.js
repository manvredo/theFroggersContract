require("dotenv").config(); // .env laden!
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x85D240f803fe51f9734b7B08fcc04eaD86d5227B";
  const contract = await ethers.getContractAt("FroggersNFT", contractAddress);
  const owner = await contract.owner();
  console.log("Owner of contract:", owner);
}

main().catch((error) => {
  console.error("Fehler beim Abrufen des Owners:", error);
  process.exitCode = 1;
});