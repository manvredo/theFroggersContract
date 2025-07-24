'use client'

import { useAccount } from 'wagmi'
import { getProofForAddress } from '@/utils/getMerkleProof'
import { useEffect, useState } from 'react'

export default function CroakWhitelistCheck() {
  const { address } = useAccount()
  const [status, setStatus] = useState<'unknown' | 'whitelisted' | 'denied'>('unknown')

  useEffect(() => {
    if (!address) {
      setStatus('unknown')
      return
    }

    const proof = getProofForAddress(address)
    if (proof && proof.length > 0) {
      setStatus('whitelisted')
    } else {
      setStatus('denied')
    }
  }, [address])

  return (
    <div className="p-4 border rounded bg-white text-center shadow-md mb-6">
      <h2 className="text-lg font-bold mb-2 text-frogGreen">🐸 Whitelist-Status</h2>

      {status === 'unknown' && (
        <p className="text-gray-500">🔎 Wallet nicht verbunden</p>
      )}

      {status === 'whitelisted' && (
        <p className="text-green-600 font-semibold">
          ✅ Whitelisted – Du darfst minten!
        </p>
      )}

      {status === 'denied' && (
        <p className="text-red-600 font-semibold">
          ❌ Nicht auf der Liste – Croak denied!
        </p>
      )}
    </div>
  )
}
