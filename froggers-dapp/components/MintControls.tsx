import { useEffect, useState } from 'react'
import { useSaleToggle } from '@/hooks/useSaleToggle'

export default function MintControls() {
  const {
    address,
    merkleRoot,
    revealed,
    presaleActive,
    publicSaleActive,
    error,
    loading,
    toggleSale,
  } = useSaleToggle()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      <p>
        👤 Connected as:{' '}
        {mounted && address ? address : '—'}
      </p>

      <div className="my-4 space-y-1">
        <p>🌿 Merkle Root: {merkleRoot || 'Not set'}</p>
        <p>👁️ Reveal active: {revealed ? '✅ Yes' : '❌ No'}</p>
        <p>🌿 Presale active: {presaleActive ? '✅ Yes' : '❌ No'}</p>
        <p>🚀 Public Sale active: {publicSaleActive ? '✅ Yes' : '❌ No'}</p>
      </div>

      <div className="flex gap-2 my-4">
        <button
          onClick={() => toggleSale('presale')}
          disabled={loading}
          className="btn-secondary w-1/2"
        >
          {loading ? '🔄 Loading...' : '🔁 Toggle Presale'}
        </button>
        <button
          onClick={() => toggleSale('publicSale')}
          disabled={loading}
          className="btn-secondary w-1/2"
        >
          {loading ? '🔄 Loading...' : '🔁 Toggle Public Sale'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
