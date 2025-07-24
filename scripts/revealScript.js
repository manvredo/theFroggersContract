const hre = require("hardhat");

async function main() {
  const contractAddress = "0x932ad1fB6f33Ce894E42f8cF2027E84D5B4b228E"; // Froggers01 Contract-Adresse
  const Froggers01 = await hre.ethers.getContractAt("Froggers01", contractAddress);

  const newBaseURI = "ipfs://QmPoMcpNTFk7UKCQT1fg8cUzdm4u41mjMnakyHjTaQPHhL/metadata/";

  const tx = await Froggers01.setBaseURI(newBaseURI, {
    gasLimit: 500000
  });

  await tx.wait();
  console.log("✅ Reveal ausgelöst! Neue baseTokenURI gesetzt:", newBaseURI);
}

main().catch((err) => {
  console.error("❌ Fehler beim Reveal:", err);
  process.exitCode = 1;
});
