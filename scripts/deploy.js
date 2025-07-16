// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Froggers01 = await hre.ethers.getContractFactory("Froggers01");
  const contract = await Froggers01.deploy("ipfs://deineCID/");
  await contract.waitForDeployment();

  console.log("✅ Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





