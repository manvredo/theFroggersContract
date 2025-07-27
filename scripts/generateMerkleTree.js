const fs = require('fs');
const path = require('path');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// 🔹 Pfade
const whitelistPath = path.join(__dirname, '../data/whitelist.json');
const outputPath = path.join(__dirname, '../data/proofs.json');

// 📥 Whitelist laden
const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf-8'));

// 🌿 Leaves generieren
const leafNodes = whitelist.map(addr => keccak256(addr.toLowerCase()));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 🌿 Root extrahieren
const root = merkleTree.getHexRoot();
console.log('🌿 Merkle Root:', root);

// 🔎 Proofs erzeugen
const proofMap = {};

whitelist.forEach(addr => {
  const leaf = keccak256(addr.toLowerCase());
  const proof = merkleTree.getHexProof(leaf);
  proofMap[addr.toLowerCase()] = { proof };
});

// 💾 Speichern
const output = { root, ...proofMap };
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('✅ Merkle Tree generiert & proofs.json geschrieben 📁');