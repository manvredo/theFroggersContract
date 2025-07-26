import { useState } from 'react'
import { usePublicMint } from '@/hooks/usePublicMint'

export default function PublicMintControls() {
  const [quantity, setQuantity] = useState(1)
  const { mint, loading, success, error } = usePublicMint()

  return (
    <div className="space-y-4">
      <div>
        <label>Mint quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="input"
        />
      </div>

      <button
        onClick={() => mint(quantity)}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '🔄 Minting...' : '✨ Public Mint'}
      </button>

      {success && (
        <div className="text-green-600">✅ Public mint successful!</div>
      )}

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
