// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const baseTokenURI = "ipfs://bafybeiaa5hlwizfgbzzo3jc3lw55dzhxek6kckz47plol2bqflbzrvfbiu/";
  
  const contract = await hre.ethers.deployContract("Froggers01", [baseTokenURI]);

  await contract.waitForDeployment();

  console.log("✅ Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




