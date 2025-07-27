const fs = require('fs');
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');

// 🔹 CLI-Input-Adresse
const addressToCheck = process.argv[2]?.toLowerCase();
if (!addressToCheck) {
  console.error('❌ Bitte Adresse angeben: node verifyProof.js <0xAdresse>');
  process.exit(1);
}

// 🔹 Dateien laden
const whitelist = JSON.parse(fs.readFileSync('./data/whitelist.json', 'utf-8'));
const proofsJson = JSON.parse(fs.readFileSync('./data/proofs.json', 'utf-8'));
const root = proofsJson.root;
const proofData = proofsJson[addressToCheck];

if (!proofData || !proofData.proof) {
  console.error('⛔ Kein Proof für diese Adresse gefunden.');
  process.exit(1);
}

// 🌿 Leaf & Tree erzeugen
const leaf = keccak256(addressToCheck);
const leafNodes = whitelist.map(addr => keccak256(addr.toLowerCase()));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 🔍 Verifikation
const isValid = merkleTree.verify(proofData.proof, leaf, root);

console.log(`\n🔍 Adresse: ${addressToCheck}`);
console.log(`🔐 Proof: ${proofData.proof.join(', ')}`);
console.log(`🌿 Merkle Root: ${root}`);
console.log(`\n📣 Ergebnis: ${isValid ? '✅ GÜLTIG für den Presale' : '❌ NICHT gültig'}\n`);