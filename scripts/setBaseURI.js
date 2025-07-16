// scripts/setBaseURI.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress = "0x2903d58C2ABb9737D44031176A8C69d60ee310E4"; // Deine Contract-Adresse
  const newBaseURI = "ipfs://bafybeiaa5hlwizfgbzzo3jc3lw55dzhxek6kckz47plol2bqflbzrvfbiu/"; // <-- IPFS-Link mit Slash am Ende

  console.log("📤 Setting baseTokenURI from:", deployer.address);

  const Froggers = await ethers.getContractAt("Froggers01", contractAddress);

  const tx = await Froggers.setBaseURI(newBaseURI);
  await tx.wait();

  console.log("✅ baseTokenURI erfolgreich gesetzt!");
}

main().catch((error) => {
  console.error("❌ Fehler beim Setzen der baseTokenURI:", error);
  process.exitCode = 1;
});





