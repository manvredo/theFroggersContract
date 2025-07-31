'use client'

import { useState, useEffect } from 'react'
import { usePublicMint } from '@/hooks/usePublicMint'

export default function PublicMintControls() {
  const [quantity, setQuantity] = useState(1)
  const { mint, loading, success, error } = usePublicMint()

  useEffect(() => {
    if (success) {
      // Optional: Reset der Menge nach erfolgreichem Mint
      setQuantity(1)
    }
  }, [success])

  const safeMint = () => {
    if (quantity <= 0) {
      alert('🚫 Ungültige Menge – mindestens 1 Frogger bitte!')
      return
    }

    try {
      mint(quantity)
    } catch (err) {
      console.error('[PublicMintControls] Mint-Fehler:', err)
    }
  }

  return (
    <div className="space-y-4 p-6 border rounded bg-white shadow-md">
      <h2 className="text-lg font-bold text-frogGreen text-center">✨ Public Mint</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Mint-Menge:</label>
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
        {loading ? '🔄 Minting...' : `✨ ${quantity} Frogger(s) minten`}
      </button>

      {success && (
        <div className="text-green-700 bg-green-100 p-3 rounded text-center">
          ✅ Public Mint erfolgreich!
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