import proofs from '@/data/proofs.json';

type ProofMap = Record<string, { proof: string[] }>;
const typedProofs: ProofMap = proofs as ProofMap;

/**
 * Prüft ob eine gegebene Zeichenkette eine gültige Ethereum-Adresse ist.
 */
function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

/**
 * Gibt den Merkle Proof für eine Adresse zurück – oder null wenn ungültig oder nicht gefunden.
 */
export function getProofForAddress(address: string): string[] | null {
  const addr = address.toLowerCase();

  if (!isValidAddress(addr)) {
    console.warn(`❌ Ungültige Ethereum-Adresse: ${address}`);
    return null;
  }

  if (!typedProofs[addr]) {
    console.warn(`🔒 Kein Merkle-Proof gefunden für: ${addr}`);
    return null;
  }

  return typedProofs[addr].proof;
}