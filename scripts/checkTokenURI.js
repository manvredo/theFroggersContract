// scripts/checkTokenURI.js
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2903d58C2ABb9737D44031176A8C69d60ee310E4";
  const tokenId = 0;

  const Froggers = await ethers.getContractAt("Froggers01", contractAddress);
  const supply = await Froggers.totalSupply();

  if (tokenId >= supply) {
    console.error(`❌ Token ${tokenId} existiert noch nicht. Aktuelle totalSupply: ${supply}`);
    return;
  }

  const uri = await Froggers.tokenURI(tokenId);
  console.log(`🧾 tokenURI für Token ${tokenId}: ${uri}`);
}

main().catch((error) => {
  console.error("❌ Fehler beim Abrufen des tokenURI:", error);
  process.exitCode = 1;
});



