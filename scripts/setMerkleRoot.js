const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // ← einsetzen!
  const Froggers = await ethers.getContractAt("Froggers01", contractAddress);

  const rootPath = path.join(__dirname, "merkleRoot.txt");
  const rawRoot = fs.readFileSync(rootPath, "utf-8").trim();

  const merkleRoot = "0x" + rawRoot.replace(/^0x/, ""); // sicherstellen, dass 0x da ist
  console.log("🔑 Merkle Root wird gesetzt:", merkleRoot);

  const tx = await Froggers.setMerkleRoot(merkleRoot);
  await tx.wait();

  console.log("✅ Merkle Root erfolgreich gesetzt!");
}

main().catch((err) => {
  console.error("❌ Fehler beim Setzen der Root:", err);
  process.exitCode = 1;
});
