const hre = require("hardhat");

async function main() {
  // 🌿 Placeholder GIF für unrevealed NFTs
  const hiddenURI = "https://thefrogger.myfilebase.com/ipfs/QmPYmEvnA6gNFLJ6mtfJVfWfxbP8Nv8ok29AVcmqYe45sD/Placeholder_04.gif";

  // 🧪 Hole den Contract-Factory
  const FroggersNFT = await hre.ethers.getContractFactory("FroggersNFT");

  // 🐸 Deploy mit hiddenURI als Parameter
  const contract = await FroggersNFT.deploy(hiddenURI);

  // ⏳ Warten, bis Deployment abgeschlossen ist
  await contract.waitForDeployment();

  // 📍 Contract-Adresse anzeigen
  console.log(`✅ FroggersNFT deployed to: ${contract.target}`);
  console.log(`🔎 Polygonscan: https://polygonscan.com/address/${contract.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});