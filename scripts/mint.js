

// scripts/mint.js
async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x85D240f803fe51f9734b7B08fcc04eaD86d5227B"; // Deine deployte Contract-Adresse auf Polygon
  const recipient = "0x2903d58C2ABb9737D44031176A8C69d60ee310E4"; // Zieladresse für das Minting (kann auch deine eigene Wallet sein)

  const Froggers01 = await ethers.getContractAt("Froggers01", contractAddress);

  console.log("Minting NFTs to:", recipient);

  const mintTx = await Froggers01.mint(recipient, 5); // Mintet 5 NFTs
  await mintTx.wait();

  console.log("✅ Mint successful!");

  console.log(`🧭 OpenSea: https://opensea.io/assets/matic/${contractAddress}/0`);
}

main().catch((error) => {
  console.error("❌ Mint failed:", error);
  process.exitCode = 1;
});

