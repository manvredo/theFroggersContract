'use client'

import { useAccount } from 'wagmi'
import { getProofForAddress } from '@/utils/getMerkleProof'
import { useEffect, useState } from 'react'

export default function CroakWhitelistCheck() {
  const { address } = useAccount()
  const [status, setStatus] = useState<'unknown' | 'whitelisted' | 'denied'>('unknown')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkWhitelist = async () => {
      if (!address) {
        setStatus('unknown')
        return
      }

      setLoading(true)
      try {
        const proof = await getProofForAddress(address)
        if (proof && proof.length > 0) {
          setStatus('whitelisted')
          sessionStorage.setItem('froggersStatus', 'whitelisted')
        } else {
          setStatus('denied')
          sessionStorage.setItem('froggersStatus', 'denied')
        }
      } catch (err) {
        console.error('[WhitelistCheck] Fehler beim Proof:', err)
        setStatus('unknown')
      } finally {
        setLoading(false)
      }
    }

    checkWhitelist()
  }, [address])

  return (
    <div className="p-4 border rounded bg-white text-center shadow-md mb-6 animate-fadeIn">
      <h2 className="text-lg font-bold mb-2 text-frogGreen">🐸 Whitelist-Status</h2>

      {loading && <p className="text-gray-500">⏳ Überprüfe deine Froschrechte...</p>}

      {!loading && status === 'unknown' && (
        <p className="text-gray-500">🔎 Wallet nicht verbunden</p>
      )}

      {!loading && status === 'whitelisted' && (
        <p className="text-green-600 font-semibold">
          ✅ Whitelisted – Du darfst minten!
        </p>
      )}

      {!loading && status === 'denied' && (
        <p className="text-red-600 font-semibold">
          ❌ Nicht auf der Liste – Croak denied!
        </p>
      )}
    </div>
  )
}