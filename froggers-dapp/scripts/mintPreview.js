require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

// 📦 ABI laden
const abi = JSON.parse(fs.readFileSync("lib/abi.json", "utf8"));

// 🛰️ Provider & Contract-Instanz erstellen
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  try {
    console.log(chalk.blue("\n🔍 Froggers Mint Preview läuft...\n"));

    // 💸 Mintpreis
    const mintPrice = await contract.mintPrice();
    const ethPrice = ethers.formatEther(mintPrice);
    console.log(chalk.yellow("💸 Mint Price:"), `${ethPrice} ETH`);

    // 🐸 Max Supply
    const maxSupply = await contract.maxSupply();
    console.log(chalk.magenta("🐸 Max Supply:"), maxSupply.toString());

    // 🧯 Pausiert?
    const paused = await contract.paused();
    console.log(chalk.cyan("🚦 Mint pausiert:"), paused ? "Ja" : "Nein");

    // 🎯 Sale-Status
    const presaleActive = await contract.presaleActive();
    const publicSaleActive = await contract.publicSaleActive();
    console.log(chalk.gray("🛡️ Presale aktiv:"), presaleActive ? "✅" : "❌");
    console.log(chalk.gray("🌍 Public Sale aktiv:"), publicSaleActive ? "✅" : "❌");

    console.log(chalk.green("\n✅ Preview abgeschlossen.\n"));
  } catch (error) {
    console.error(chalk.red("\n❌ Fehler aufgetreten:"), error);
  }
}

main();