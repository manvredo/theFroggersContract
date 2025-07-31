'use client'

import { useState, useEffect } from 'react'
import { getProofForAddress } from '@/utils/getMerkleProof'
import { useSaleToggle } from '@/hooks/useSaleToggle'
// import { writeContract } from 'wagmi' // Optional: smart contract call

export default function MintForm({ address }: { address: string }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const { presaleActive, publicSaleActive } = useSaleToggle()

  // 🧹 Reset Status on wallet change
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

        // 🔐 Contract call here (e.g. wagmi)
        // await writeContract({
        //   address: contractAddress,
        //   abi: contractAbi,
        //   functionName: 'presaleMint',
        //   args: [proof],
        //   account: address,
        // })

        setTimeout(() => {
          setStatus('✅ Presale Mint erfolgreich!')
          setLoading(false)
        }, 1500)
        return
      }

      if (publicSaleActive) {
        // Contract call for public mint
        // await writeContract({ ... })

        setTimeout(() => {
          setStatus('✅ Public Mint erfolgreich!')
          setLoading(false)
        }, 1500)
        return
      }

      setStatus('🔒 Momentan ist kein Sale aktiv.')
    } catch (err) {
      console.error('[presaleMint] ❌ Fehler beim Mint:', err)
      setStatus('❌ Fehler beim Mint-Vorgang.')
    } finally {
      setLoading(false)
    }
  }

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

      {status && (
        <p className="mt-2 text-sm text-center text-frogGreen animate-fadeIn">
          {status}
        </p>
      )}
    </div>
  )
}