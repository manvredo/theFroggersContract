const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deine CID mit Metadaten-Ordner (Schrägstrich am Ende wichtig!)
  const baseTokenURI = "ipfs://QmPoMcpNTFk7UKCQT1fg8cUzdm4u41mjMnakyHjTaQPHhL/metadata/";

  // Contract vorbereiten & deployen mit 2 Parametern: baseTokenURI & Owner
  const Froggers01 = await hre.ethers.getContractFactory("Froggers01");
  const contract = await Froggers01.deploy(baseTokenURI, deployer.address);
  await contract.waitForDeployment();

  // Contract-Adresse ausgeben
  const deployedAddress = await contract.getAddress();
  console.log("✅ Froggers01 deployed to:", deployedAddress);
  console.log("📄 baseTokenURI gesetzt auf:", baseTokenURI);
  console.log(`🧭 OpenSea Preview: https://testnets.opensea.io/assets/sepolia/${deployedAddress}/0`);
}

main().catch((error) => {
  console.error("❌ Fehler beim Deployment:", error);
  process.exitCode = 1;
});







