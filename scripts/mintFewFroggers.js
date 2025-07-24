const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x9d895Be7d481CCA2B4BFc03885Eb95d53FfCEa43"; // ← Adresse deines Froggers01-Vertrags
  const recipient = "0x2903d58C2ABb9737D44031176A8C69d60ee310E4";                         // ← hier deine Sepolia-Wallet-Adresse eintragen
  const quantity = 3; // Anzahl der Froggers für den Test

  const Froggers = await ethers.getContractAt("Froggers01", contractAddress);

  console.log(`🐸 Minting ${quantity} Froggers an ${recipient}...`);
  const tx = await Froggers.mint(recipient, quantity);
  await tx.wait();
  console.log("✅ Mint erfolgreich!");

  for (let i = 0; i < quantity; i++) {
    const uri = await Froggers.tokenURI(i);
    console.log(`📄 tokenURI(${i}): ${uri}`);
    const ipfsHash = uri.replace("ipfs://", "");
    console.log(`🌐 Vorschau: https://ipfs.filebase.io/ipfs/${ipfsHash}`);
    console.log(`🧭 OpenSea: https://testnets.opensea.io/assets/sepolia/${contractAddress}/${i}`);
  }
}

main().catch((error) => {
  console.error("❌ Fehler beim Minting:", error);
  process.exitCode = 1;
});
