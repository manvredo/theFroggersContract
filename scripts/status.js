const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xF9fA957fC52D69ACED512Ad395B514F9e6539a83"; // ⬅️ dein FroggersNFT Contract
  const FroggersNFT = await ethers.getContractFactory("FroggersNFT");
  const contract = await FroggersNFT.attach(contractAddress);

  const [signer] = await ethers.getSigners();
  const connectedAddress = await signer.getAddress();

  const presale = await contract.presaleActive();
  const publicsale = await contract.publicSaleActive();
  const revealed = await contract.revealed();
  const paused = await contract.paused();
  const totalSupply = await contract.totalSupply();
  const owner = await contract.owner();

  let mintPrice = "🔍 Nicht im Contract sichtbar";
  let baseURI = "🔍 Nicht im Contract sichtbar";
  let merkleRoot = "🔍 Nicht im Contract sichtbar";

  // Sicher abfragen mit try-catch
  try {
    const price = await contract.mintPrice();
    mintPrice = ethers.utils.formatEther(price) + " ETH";
  } catch {}
  try {
    baseURI = await contract.baseURI();
  } catch {}
  try {
    merkleRoot = await contract.merkleRoot();
  } catch {}

  console.log("\n🐸 FroggersNFT Status Überblick");
  console.log("-------------------------------");
  console.log("👤 Verbunden als:", connectedAddress);
  console.log("🧪 Presale aktiv:", presale ? "✅ Ja" : "❌ Nein");
  console.log("🚀 Public Sale aktiv:", publicsale ? "✅ Ja" : "❌ Nein");
  console.log("👁️ Reveal aktiv:", revealed ? "✅ Ja" : "❌ Nein");
  console.log("🛑 Contract pausiert:", paused ? "⏸️ Ja" : "▶️ Nein");
  console.log("📦 Aktuelle Supply:", totalSupply.toString(), "/ 5555");
  console.log("💸 Mint-Preis:", mintPrice);
  console.log("🔐 Contract Owner:", owner);
  console.log("🌐 Base URI:", baseURI);
  console.log("🌿 Merkle Root:", merkleRoot);
  console.log("-------------------------------\n");
}

main().catch((error) => {
  console.error("❌ Fehler beim Status-Check:", error);
  process.exitCode = 1;
});