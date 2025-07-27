require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// 🔍 Debug-Ausgabe zur Kontrolle
console.log("🔌 RPC:", process.env.RPC_URL);
console.log("🔐 PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("🎯 CONTRACT:", process.env.CONTRACT_ADDRESS);

// 📦 FroggersNFT ABI laden
const abi = JSON.parse(fs.readFileSync("abi.json", "utf8"));

// 🛰️ Provider & Wallet konfigurieren
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  try {
    // 🕵️ Presale-Status vor dem Toggle
    const presaleBefore = await contract.presaleActive();
    console.log("Presale aktiv vor dem Toggle?", presaleBefore);

    // 🔁 Toggle-Funktion ausführen
    const tx = await contract.togglePresale();
    console.log("⏳ Transaktion gesendet:", tx.hash);

    // ⛓️ Warten auf Bestätigung
    await tx.wait();
    console.log("✅ Transaktion bestätigt.");

    // 🔎 Presale-Status nach dem Toggle
    const presaleAfter = await contract.presaleActive();
    console.log("Presale aktiv nach dem Toggle?", presaleAfter);
  } catch (error) {
    console.error("❌ Fehler aufgetreten:", error);
  }
}

main();