import fs from 'fs'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

// 1. Whitelist laden
const whitelist = JSON.parse(fs.readFileSync('data/whitelist.json', 'utf-8')) as string[]

// 2. Adressen zu Blättern hashen
const leafNodes = whitelist.map(addr => keccak256(addr.toLowerCase()))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })

// 3. Root extrahieren
const root = merkleTree.getHexRoot()

// 4. Für jede Adresse den Proof erstellen
const proofMap: Record<string, { proof: string[] }> = {}
whitelist.forEach(addr => {
  const leaf = keccak256(addr.toLowerCase())
  const proof = merkleTree.getHexProof(leaf)
  proofMap[addr.toLowerCase()] = { proof }
})

// 5. Alles in proofs.json speichern
const output = { root, ...proofMap }
fs.writeFileSync('data/proofs.json', JSON.stringify(output, null, 2))

console.log('✅ Merkle Tree generiert und proofs.json geschrieben.')


