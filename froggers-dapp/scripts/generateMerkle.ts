import fs from 'fs';
import path from 'path';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import chalk from 'chalk';

// 🐸 Whitelist laden
const whitelistPath = path.resolve(process.cwd(), 'data/whitelist.json');
if (!fs.existsSync(whitelistPath)) {
  console.log(chalk.red('❌ Datei fehlt: data/whitelist.json'));
  process.exit(1);
}

const raw = fs.readFileSync(whitelistPath, 'utf8');
const whitelist: string[] = JSON.parse(raw);
if (!Array.isArray(whitelist)) {
  console.log(chalk.red('❌ whitelist.json muss ein Array aus Adressen sein.'));
  process.exit(1);
}

console.log(chalk.blue(`📄 ${whitelist.length} Adressen geladen.`));

// 🧠 Hashen & MerkleTree bauen
const leafNodes = whitelist.map(addr => keccak256(addr.toLowerCase()));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 🔗 Merkle Root extrahieren
const root = merkleTree.getHexRoot();
console.log(chalk.green(`🌿 Merkle Root: ${root}`));

// 🧪 Für jede Adresse den Proof generieren
const proofMap: Record<string, { proof: string[] }> = {};
whitelist.forEach(addr => {
  const leaf = keccak256(addr.toLowerCase());
  const proof = merkleTree.getHexProof(leaf);
  proofMap[addr.toLowerCase()] = { proof };
});

// 📦 Alles in proofs.json speichern
const output = { root, ...proofMap };
const outputPath = path.resolve(process.cwd(), 'data/proofs.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(chalk.magenta('✅ proofs.json erfolgreich generiert!'));


