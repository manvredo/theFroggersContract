'use client'

import { useState, useEffect } from 'react'
import { getProofForAddress } from '@/utils/getMerkleProof'
import { useSaleToggle } from '@/hooks/useSaleToggle'
// Optional: wagmi imports für Contract Call
// import { useContractWrite } from 'wagmi'

export default function MintForm({ address }: { address: string }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    presaleActive,
    publicSaleActive,
  } = useSaleToggle()

  const handleMint = async () => {
    setLoading(true)
    setStatus('⏳ Mint wird vorbereitet...')

    // PRESALE → mit Proof
    if (presaleActive) {
      const proof = getProofForAddress(address)

      if (!proof) {
        setStatus('🚫 Du bist nicht auf der Whitelist.')
        setLoading(false)
        return
      }

      // TODO: Contract Call für presaleMint mit Proof
      // mint.write({ args: [proof] })

      setTimeout(() => {
        setStatus('✅ Presale Mint erfolgreich!')
        setLoading(false)
      }, 1500) // Simulation
      return
    }

    // PUBLIC SALE → ohne Proof
    if (publicSaleActive) {
      // TODO: Contract Call für public mint
      // mint.write({ args: [amount] })

      setTimeout(() => {
        setStatus('✅ Public Mint erfolgreich!')
        setLoading(false)
      }, 1500) // Simulation
      return
    }

    // Kein Sale aktiv
    setStatus('🔒 Momentan ist kein Sale aktiv.')
    setLoading(false)
  }

  // 🧾 Info über Sale-Modus
  const getSaleLabel = () => {
    if (presaleActive) return 'Presale aktiv – Whitelist erforderlich'
    if (publicSaleActive) return 'Public Sale aktiv – jeder darf minten'
    return 'Kein Sale aktiv – warte auf Start'
  }

  return (
    <div className="p-6 border rounded bg-white text-glibberGray shadow-lg flex flex-col gap-4 items-center">
      <h2 className="text-lg font-semibold">🐸 Mint dein Frogger</h2>
      <p className="text-sm font-mono text-center">{address}</p>

      <p className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
        {getSaleLabel()}
      </p>

      <button
        onClick={handleMint}
        disabled={loading}
        className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
      >
        {loading ? 'Croaking...' : 'Mint starten'}
      </button>

      {status && <p className="mt-2 text-sm text-center">{status}</p>}
    </div>
  )
}