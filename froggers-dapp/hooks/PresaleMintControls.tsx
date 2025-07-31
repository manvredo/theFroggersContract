'use client'

import { useState, useEffect } from 'react'
import { usePresaleMint } from '@/hooks/usePresaleMint'
import { getProofForAddress } from '@/utils/getMerkleProof'

type Props = {
  address: string
}

export default function PresaleMintControls({ address }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [proof, setProof] = useState<string[]>([])
  const { mint, loading, success, error } = usePresaleMint()

  useEffect(() => {
    if (!address) {
      setProof([])
      return
    }

    const userProof = getProofForAddress(address)
    setProof(userProof ?? [])
  }, [address])

  const safeMint = async () => {
    if (quantity <= 0) return alert('🚫 Ungültige Menge: min. 1')
    if (!proof || proof.length === 0)
      return alert('🚫 Kein gültiger Whitelist-Proof gefunden')
    mint(quantity, proof)
  }

  return (
    <div className="space-y-4 p-6 border rounded bg-white shadow-md">
      <h2 className="text-lg font-bold text-frogGreen text-center">🐸 Presale Mint</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Anzahl Minten:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <button
        onClick={safeMint}
        disabled={loading}
        className="w-full bg-frogGreen text-white py-2 rounded hover:brightness-110 disabled:opacity-50"
      >
        {loading ? '🔄 Minting...' : `🐸 Mint ${quantity} Froggers`}
      </button>

      {success && (
        <div className="text-green-700 bg-green-100 p-3 rounded text-center">
          ✅ Presale Mint erfolgreich!
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          <strong>Fehler:</strong> {error}
        </div>
      )}
    </div>
  )
}