const hre = require("hardhat");

async function main() {
  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← deine FroggersNFT-Adresse
  const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);

  const tokenId = 0; // ← ändern auf 1, 2, etc. je nachdem welche Token du prüfen willst

  console.log(`🔍 Frage tokenURI für Token #${tokenId} ab ...`);

  const tokenURI = await FroggersNFT.tokenURI(tokenId);
  console.log("📦 tokenURI gefunden:", tokenURI);

  // Wenn IPFS-Link → direkte Vorschau ergänzen
  if (tokenURI.startsWith("ipfs://")) {
    const httpURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log("🌐 IPFS-Vorschau-Link:", httpURI);
  }
}

main().catch((err) => {
  console.error("❌ Fehler beim Abrufen der tokenURI:", err);
  process.exitCode = 1;
});




