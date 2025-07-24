const hre = require("hardhat");

async function main() {
  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← deine Froggers-Adresse!
  const Froggers01 = await hre.ethers.getContractAt("Froggers01", contractAddress);

  const tokenId = 0; // ← ändern auf 1, 2 etc. falls du weitere minted hast

  console.log(`🔍 Frage tokenURI für Token #${tokenId} ab ...`);

  const tokenURI = await Froggers01.tokenURI(tokenId);
  console.log("📦 tokenURI gefunden:", tokenURI);

  // Wenn IPFS-Link → direktes Vorschau-Format ergänzen
  if (tokenURI.startsWith("ipfs://")) {
    const httpURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log("🌐 IPFS-Vorschau-Link:", httpURI);
  }
}

main().catch((err) => {
  console.error("❌ Fehler beim Abrufen der tokenURI:", err);
  process.exitCode = 1;
});




