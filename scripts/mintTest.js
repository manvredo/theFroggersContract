const hre = require("hardhat");

async function main() {
  // Adresse deines bereits deployten Contracts:
  const contractAddress = "0xDEIN_CONTRACT_ADDRESS_HIER";

  const Froggers = await hre.ethers.getContractAt("Froggers", contractAddress);

  const quantityToMint = 3; // Anzahl der Froggers
  const tx = await Froggers.mint(quantityToMint);
  await tx.wait();

  console.log(`✅ Erfolgreich ${quantityToMint} Froggers gemintet`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Minting fehlgeschlagen:", error);
    process.exit(1);
  });
