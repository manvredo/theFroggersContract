import { useState } from 'react'
import { usePresaleMint } from '@/hooks/usePresaleMint'

export default function PresaleMintControls() {
  const [quantity, setQuantity] = useState(1)
  const [proof, setProof] = useState<string[]>([]) // → dein Proof logic hier
  const { mint, loading, success, error } = usePresaleMint()

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
        onClick={() => mint(quantity, proof)}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '🔄 Minting...' : '🐸 Presale Mint'}
      </button>

      {success && (
        <div className="text-green-600">✅ Presale mint successful!</div>
      )}

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
