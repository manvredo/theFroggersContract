const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const addr = signer.address;

  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← deine Froggers-Adresse
  const Froggers01 = await hre.ethers.getContractAt("Froggers01", contractAddress);

  const total = await Froggers01.totalSupply();
  const minted = await Froggers01.presaleMinted(addr);
  const merkleRoot = await Froggers01.merkleRoot();
  const presaleActive = await Froggers01.presaleActive();

  console.log("👤 Deine Adresse:", addr);
  console.log("🐸 Bisher im Presale gemintet:", minted.toString());
  console.log("🎯 Gesamtmenge (totalSupply):", total.toString());
  console.log("🧬 Aktuelle Merkle Root:", merkleRoot);
  console.log("🚦 Presale Status:", presaleActive ? "Aktiv ✅" : "Deaktiv 🚫");

  const mintLimit = 2;
  const remaining = mintLimit - Number(minted);
  console.log("🔢 Deine verbleibende Mint-Menge:", remaining);

  if (remaining > 0 && presaleActive) {
    console.log("✅ Du kannst noch minten!");
  } else if (!presaleActive) {
    console.log("⏸️ Presale ist nicht aktiv. Aktiviere mit `togglePresale()`.");
  } else {
    console.log("🚫 Du hast dein Presale-Limit erreicht.");
  }
}

main().catch((err) => {
  console.error("❌ Fehler beim Debug-Mint:", err);
  process.exitCode = 1;
});
