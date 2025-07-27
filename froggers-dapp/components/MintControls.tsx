import { useEffect, useState } from 'react'
import { useSaleToggle } from '@/hooks/useSaleToggle'

export default function MintControls() {
  const {
    address,
    revealed,
    presaleActive,
    publicSaleActive,
    error,
    loading,
    toggleSale,
  } = useSaleToggle()

  const [mounted, setMounted] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // ⛳ Dynamische Statusmeldung
  useEffect(() => {
    if (presaleActive) {
      setStatusMessage('🌿 Presale ist aktiviert 🟢')
    } else if (publicSaleActive) {
      setStatusMessage('🚀 Public Sale ist aktiviert 🟣')
    } else {
      setStatusMessage('🔒 Kein Sale aktiv')
    }
  }, [presaleActive, publicSaleActive])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🐸 Froggers NFT Minting</h2>

      <p>👤 Connected as: {mounted && address ? address : '—'}</p>

      <div className="space-y-1">
        <p>👁️ Reveal active: {revealed ? '✅ Yes' : '❌ No'}</p>
        <p>🌿 Presale active: {presaleActive ? '✅ Yes' : '❌ No'}</p>
        <p>🚀 Public Sale active: {publicSaleActive ? '✅ Yes' : '❌ No'}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-green-700 bg-green-100 rounded px-3 py-2">
          {statusMessage}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => toggleSale('presale')}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? '🔄 Updating...' : '🔁 Toggle Presale'}
        </button>
        <button
          onClick={() => toggleSale('publicSale')}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? '🔄 Updating...' : '🔁 Toggle Public Sale'}
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