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

  return (
    <div>
      <p>👤 Verbunden als: {address}</p>
      <div className="my-4 space-y-1">
        <p>🌿 Merkle Root: {merkleRoot || 'Keine gefunden'}</p>
        <p>👁️ Reveal aktiv: {revealed ? '✅ Ja' : '❌ Nein'}</p>
        <p>🌿 Presale aktiv: {presaleActive ? '✅ Ja' : '❌ Nein'}</p>
        <p>🚀 Public Sale aktiv: {publicSaleActive ? '✅ Ja' : '❌ Nein'}</p>
      </div>

      <div className="flex gap-2 my-4">
        <button
          onClick={() => toggleSale('presale')}
          disabled={loading}
          className="btn-secondary w-1/2"
        >
          {loading ? '🔄 Lade...' : '🔁 Presale umschalten'}
        </button>
        <button
          onClick={() => toggleSale('publicSale')}
          disabled={loading}
          className="btn-secondary w-1/2"
        >
          {loading ? '🔄 Lade...' : '🔁 Public Sale umschalten'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          <strong>Fehler:</strong> {error}
        </div>
      )}
    </div>
  )
}
