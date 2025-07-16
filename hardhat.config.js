require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ← Stelle sicher, dass dotenv geladen wird

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};







