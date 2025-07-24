const hre = require("hardhat");

async function main() {
  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E";
  const Froggers01 = await hre.ethers.getContractAt("Froggers01", contractAddress);

  const tokenId = 1;
  const tokenURI = await Froggers01.tokenURI(tokenId);
  console.log(`📦 tokenURI für Token #${tokenId}:`, tokenURI);

  if (tokenURI.startsWith("ipfs://")) {
    const httpURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log("🌐 IPFS-Vorschau-Link:", httpURI);
  }
}

main().catch((err) => {
  console.error("❌ Fehler beim tokenURI-Check:", err);
  process.exitCode = 1;
});

