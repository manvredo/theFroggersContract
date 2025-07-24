import { useState } from 'react'
import { usePresaleMint } from '@/hooks/usePresaleMint'

export default function PresaleMint({ merkleRoot, userProof }: { merkleRoot: string, userProof: string[] }) {
  const [amount, setAmount] = useState(1)
  const { mintPresale, loading, error } = usePresaleMint()

  return (
    <div className="my-4 p-4 border rounded bg-white">
      <h2 className="text-xl font-semibold mb-2">🌿 Presale Mint</h2>
      <p className="mb-2">Merkle Root: {merkleRoot || 'nicht gesetzt'}</p>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-2 py-1 w-16"
        />
        <button
          onClick={() => mintPresale(amount, userProof)}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? '🔄 Minting...' : `Mint ${amount} NFT${amount > 1 ? 's' : ''}`}
        </button>
      </div>

      {error && <p className="text-red-600">❌ {error}</p>}
    </div>
  )
}

