'use client'

import { useState } from 'react'
import { getProofForAddress } from '@/utils/getMerkleProof'

export default function MintForm({ address }: { address: string }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMint = async () => {
    setLoading(true)
    const proof = getProofForAddress(address)

    if (!proof) {
      setStatus('🚫 Du bist nicht auf der Whitelist.')
      setLoading(false)
      return
    }

    // TODO: Contract Call mit wagmi: z.B. presaleMint(proof)
    // Hier kommt später dein mint.write({ args: [...] })

    setTimeout(() => {
      setStatus('✅ Mint erfolgreich!')
      setLoading(false)
    }, 1500) // Simulation
  }

  return (
    <div className="p-6 border rounded bg-white text-glibberGray shadow-lg flex flex-col gap-4 items-center">
      <h2 className="text-lg font-semibold">🐸 Mint dein Frogger</h2>
      <p className="text-sm font-mono text-center">{address}</p>
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
