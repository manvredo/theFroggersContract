'use client'

import { useState, useEffect } from 'react'
import { getProofForAddress } from '@/utils/getMerkleProof'
import { useSaleToggle } from '@/hooks/useSaleToggle'
// Optional: wagmi.writeContract oder viem.executeContract

export default function MintButton({ address }: { address: string }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const { presaleActive, publicSaleActive } = useSaleToggle()

  // 🧹 Reset Status wenn Wallet wechselt
  useEffect(() => {
    setStatus('')
  }, [address])

  const handleMint = async () => {
    setLoading(true)
    setStatus('⏳ Mint wird vorbereitet...')

    try {
      if (presaleActive) {
        const proof = getProofForAddress(address)

        if (!proof || proof.length === 0) {
          setStatus('🚫 Du bist nicht auf der Whitelist.')
          setLoading(false)
          return
        }

        // 🧪 Hier dein Smart Contract Call z. B. mit wagmi:
        // await writeContract({ address: ..., functionName: 'presaleMint', args: [proof] })

        setTimeout(() => {
          setStatus('✅ Presale Mint erfolgreich!')
          setLoading(false)
        }, 1500)

        return
      }

      if (publicSaleActive) {
        // 🧪 publicMint Call → z. B. mit amount: 1
        // await writeContract({ address: ..., functionName: 'publicMint', args: [1] })

        setTimeout(() => {
          setStatus('✅ Public Mint erfolgreich!')
          setLoading(false)
        }, 1500)

        return
      }

      setStatus('🔒 Kein Sale aktiv – warte auf den Start.')
      setLoading(false)
    } catch (err) {
      console.error('[MintButton] ❌ Mint-Vorgang fehlgeschlagen:', err)
      setStatus('❌ Fehler beim Mint-Vorgang.')
      setLoading(false)
    }
  }

  const saleLabel = presaleActive
    ? 'Presale aktiv – Whitelist erforderlich'
    : publicSaleActive
    ? 'Public Sale aktiv – jeder darf minten'
    : 'Kein Sale aktiv'

  return (
    <div className="p-6 border rounded bg-white text-glibberGray shadow-lg flex flex-col gap-4 items-center">
      <h2 className="text-lg font-semibold">🐸 Mint dein Frogger</h2>
      <p className="text-sm font-mono text-center">{address}</p>

      <p className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
        {saleLabel}
      </p>

      <button
        onClick={handleMint}
        disabled={loading || (!presaleActive && !publicSaleActive)}
        className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
      >
        {loading ? 'Croaking...' : 'Mint starten'}
      </button>

      {status && (
        <p className="mt-2 text-sm text-center text-frogGreen animate-fadeIn">
          {status}
        </p>
      )}
    </div>
  )
}