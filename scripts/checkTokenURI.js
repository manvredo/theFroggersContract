const hre = require("hardhat");

async function main() {
  // Adresse deines Contracts hier rein:
  const contractAddress = "0x44a92E468de1c1C8B7e838b8a65F7b972B4e8121";

  const contract = await hre.ethers.getContractAt("Froggers01", contractAddress);

  const tokenId = 0; // Token-Id prüfen (z.B. 0)

  const uri = await contract.tokenURI(tokenId);
  console.log(`📦 tokenURI(${tokenId}):`, uri);
}

main()
  .catch((error) => {
    console.error("❌ Fehler:", error);
    process.exitCode = 1;
  });


