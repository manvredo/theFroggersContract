require("dotenv").config();
const hre = require("hardhat");

async function main() {
  // 🧍‍♂️ Aktuellen Signer holen
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🔐 Verwende Wallet: ${deployer.address}`);

  // 🏗️ Contract laden
  const contract = await hre.ethers.getContractAt(
    "FroggersNFT",
    "0x85D240f803fe51f9734b7B08fcc04eaD86d5227B"
  );

  // ✅ Ownership prüfen
  const owner = await contract.owner();
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    throw new Error("🚫 Zugriff verweigert: Du bist nicht der Owner des Contracts.");
  }

  // 💸 Funds abziehen
  const tx = await contract.withdraw();
  console.log(`💸 Withdrawal TX gesendet: ${tx.hash}`);

  // ⏳ Auf Bestätigung warten
  await tx.wait();
  console.log("✅ Mittel erfolgreich übertragen!");
}

main().catch((error) => {
  console.error("❌ Fehler beim Withdrawal:", error);
  process.exitCode = 1;
});