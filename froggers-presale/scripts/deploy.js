const hre = require("hardhat");

async function main() {
  const Froggers = await hre.ethers.getContractFactory("FroggersPresale");
  const contract = await Froggers.deploy();
  await contract.deployed();

  console.log("🐸 Contract deployed to:", contract.address);

  const root = "0xDEIN_MERKLE_ROOT_HIER";
  const tx = await contract.setMerkleRoot(root);
  await tx.wait();

  console.log("🌿 Merkle Root gesetzt!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});