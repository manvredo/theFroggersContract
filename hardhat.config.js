require("@nomicfoundation/hardhat-toolbox"); // enthält Ethers, Waffle, Etherscan etc.
require("dotenv").config(); // lädt Umgebungsvariablen aus .env-Datei

module.exports = {
  solidity: "0.8.28", // Stelle sicher, dass dein Smart Contract mit dieser Version geschrieben ist
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // für lokale Tests
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // z. B. Infura oder Alchemy-URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // der Account, der verwendet wird – Private Key ohne "0x" in .env!
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "", // optional, falls du Verträge verifizieren möchtest
    },
  },
};









