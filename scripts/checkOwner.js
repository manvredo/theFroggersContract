const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("🔍 Aktueller Signer:", signer.address);

  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← deine Froggers-Adresse einsetzen!
  const Froggers01 = await hre.ethers.getContractAt("Froggers01", contractAddress);

  const owner = await Froggers01.owner();
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
