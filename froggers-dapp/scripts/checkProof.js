const fs = require("fs");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const chalk = require("chalk");

// 📦 Proofs laden
const proofsData = JSON.parse(fs.readFileSync("data/proofs.json", "utf8"));

// 🌿 Merkle Root extrahieren
const root = proofsData.root;

// 🧪 Adresse prüfen – aus CLI Argument oder hardcoded (für Test)
const inputAddress = process.argv[2] || "0x1234567890abcdef1234567890abcdef12345678";
const lowerAddr = inputAddress.toLowerCase();

// 🚨 Validierung
function isValidAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

if (!isValidAddress(lowerAddr)) {
  console.log(chalk.red(`❌ Ungültige Adresse: ${inputAddress}`));
  process.exit(1);
}

if (!proofsData[lowerAddr]) {
  console.log(chalk.yellow(`🔒 Kein Proof gefunden für: ${lowerAddr}`));
  process.exit(1);
}

const leaf = keccak256(lowerAddr);
const proof = proofsData[lowerAddr].proof;

// 🌳 MerkleTree lokal wiederaufbauen
const allAddresses = Object.keys(proofsData).filter(k => k !== "root");
const leafNodes = allAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const isValid = merkleTree.verify(proof, leaf, root);

if (isValid) {
  console.log(chalk.green(`✅ Adresse ${lowerAddr} ist auf der Whitelist!`));
} else {
  console.log(chalk.red(`❌ Proof für ${lowerAddr} ist NICHT gültig.`));
}