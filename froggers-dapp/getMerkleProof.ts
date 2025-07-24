import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import whitelist from './whitelist.json' // 🔧 Achte auf richtigen Pfad & Dateiname!

export function getProofForAddress(address: string): string[] {
  const normalizedAddress = address.toLowerCase()
  const typedWhitelist: string[] = whitelist
  const leaves = typedWhitelist.map((addr: string) => keccak256(addr.toLowerCase()))
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

  const leaf = keccak256(normalizedAddress)
  const proof = tree.getHexProof(leaf)

  if (proof.length === 0) {
    console.warn(`🔒 Kein Merkle-Proof gefunden für: ${address}`)
  }

  return proof
}

// 🧪 Direkt ausführbarer Test
if (require.main === module) {
  const testAddress = '0x2903d58c2abb9737d44031176a8c69d60ee310e4' // 🔍 Passe diese Adresse ggf. an!
  const proof = getProofForAddress(testAddress)

  console.log('✅ Merkle Proof für Adresse:', testAddress)
  console.log('🧾 Proof:', proof)
}




