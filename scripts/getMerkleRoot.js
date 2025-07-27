const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x90918d3BD876575BC5c594DA286DC7Abb6e1E1b2"; // 🔁 Aktuelle Contract-Adresse eintragen
  const FroggersNFT = await ethers.getContractFactory("FroggersNFT");
  const contract = await FroggersNFT.attach(contractAddress);

  const merkleRoot = await contract.merkleRoot();
  console.log("🌿 Aktuelle Merkle Root:", merkleRoot);
}

main().catch((error) => {
  console.error("❌ Fehler beim Abrufen:", error);
  process.exitCode = 1;
});