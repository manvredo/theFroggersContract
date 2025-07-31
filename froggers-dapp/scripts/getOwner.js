// .env-Datei laden (für z. B. RPC-URL und PRIVATE_KEY, falls notwendig)
require("dotenv").config();

const { ethers } = require("hardhat");

async function main() {
  // Die Adresse des bereits deployten Vertrags auf Sepolia
  const contractAddress = "0x85D240f803fe51f9734b7B08fcc04eaD86d5227B";

  // Den Vertrag laden – der Name muss mit dem übereinstimmen, wie du ihn in Solidity definiert hast:
  // contract FroggersNFT { ... }
  const contract = await ethers.getContractAt("FroggersNFT", contractAddress);

  // owner() ist meist eine public view-Funktion bei Ownable-Verträgen
  const owner = await contract.owner();

  console.log("✅ Besitzer des Vertrags ist:", owner);
}

// Fehlerbehandlung
main().catch((error) => {
  console.error("❌ Fehler beim Abrufen des Owners:", error.message || error);
  process.exitCode = 1;
});
