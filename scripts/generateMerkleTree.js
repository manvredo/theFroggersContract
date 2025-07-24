const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');
const path = require('path');

// 📋 Whitelist einlesen
const addresses = require('./whitelist.json');

// 🌿 Leaf-Nodes erzeugen
const leafNodes = addresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 🧠 Merkle Root extrahieren
const root = merkleTree.getRoot().toString('hex');
console.log('🌳 Merkle Root:', root);

// 📦 Root speichern
fs.writeFileSync(path.join(__dirname, 'merkleRoot.txt'), root);
console.log('✅ Root gespeichert in merkleRoot.txt');

// 🔐 Optional: einzelne Proofs speichern
const proofsDir = path.join(__dirname, 'proofs');
if (!fs.existsSync(proofsDir)) fs.mkdirSync(proofsDir);

addresses.forEach(addr => {
  const proof = merkleTree.getHexProof(keccak256(addr));
  const filename = path.join(proofsDir, `${addr}.json`);
  fs.writeFileSync(filename, JSON.stringify(proof, null, 2));
  console.log(`🛡️ Proof für ${addr} gespeichert.`);
});

