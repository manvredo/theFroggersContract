const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← deine FroggersNFT-Adresse!
  const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);

  const quantity = 1;
  const presalePrice = hre.ethers.parseEther("0.005"); // aus deinem Contract
  const totalPrice = presalePrice * BigInt(quantity);

  // 👤 Adresse & Proof laden
  const addr = signer.address;
  const proofPath = path.join(__dirname, "proofs", `${addr}.json`);

  if (!fs.existsSync(proofPath)) {
    console.error(`❌ Kein Proof gefunden für: ${addr}`);
    return;
  }

  const proof = JSON.parse(fs.readFileSync(proofPath, "utf-8"));
  console.log("🛡️ Proof geladen für:", addr);
  console.log("🚀 Starte Presale-Mint mit Menge:", quantity);

  // 🐸 Mint ausführen
  const tx = await FroggersNFT.presaleMint(quantity, proof, {
    value: totalPrice,
    gasLimit: 500000
  });

  const receipt = await tx.wait();
  console.log("✅ Presale-Mint erfolgreich! TX Hash:", receipt.hash);
}

main().catch((err) => {
  console.error("❌ Fehler beim Presale-Mint:", err);
  process.exitCode = 1;
});
