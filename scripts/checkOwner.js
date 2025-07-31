const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("🔍 Aktueller Signer:", signer.address);

  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← deine FroggersNFT-Adresse einsetzen!
  const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);

  const owner = await FroggersNFT.owner();
  console.log("👑 Contract Owner laut Blockchain:", owner);

  if (signer.address.toLowerCase() === owner.toLowerCase()) {
    console.log("✅ Du bist der Owner. Alle Funktionen stehen dir offen!");
  } else {
    console.log("🚫 Nicht der Owner – Zugriff auf ownerOnly-Funktionen blockiert.");
  }
}

main().catch((error) => {
  console.error("❌ Fehler beim Ausführen:", error);
  process.exitCode = 1;
});
