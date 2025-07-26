const hre = require("hardhat");

async function main() {
  // 🌿 Placeholder GIF für unrevealed NFTs
  const hiddenURI = "https://vertical-plum-alligator.myfilebase.com/ipfs/QmPYmEvnA6gNFLJ6mtfJVfWfxbP8Nv8ok29AVcmqYe45sD/Placeholder_04.gif";

  // 🧪 Hole den Contract-Factory
  const FroggersNFT = await hre.ethers.getContractFactory("FroggersNFT");

  // 🐸 Deploy mit hiddenURI als Parameter
  const contract = await FroggersNFT.deploy(hiddenURI);

  // ⏳ Warten, bis Deployment abgeschlossen ist
  await contract.waitForDeployment();

  // 📍 Contract-Adresse anzeigen
  console.log(`✅ FroggersNFT deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});