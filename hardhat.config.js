require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Lokales Hardhat-Netzwerk
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // z.B. von Infura oder Alchemy
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};










