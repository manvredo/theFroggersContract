'use client'

import { useEffect, useState } from 'react'
import { readContract } from '@wagmi/core'
import abi from '@/lib/abi.json'

type Props = {
  contractAddress: `0x${string}`
  tokenId: number
}

export default function TokenPreview({ contractAddress, tokenId }: Props) {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchTokenURI = async () => {
      setLoading(true)
      setError(false)

      try {
        const uri = await readContract({
          address: contractAddress,
          abi,
          functionName: 'tokenURI',
          args: [tokenId],
        })

        const response = await fetch(uri as string)
        if (!response.ok) throw new Error('Token URI fetch failed')

        const metadata = await response.json()
        const img = metadata?.image ?? '/images/fallback.png'
        setImageUrl(img)
      } catch (err) {
        console.error(`[TokenPreview] Fehler bei Token ${tokenId}:`, err)
        setImageUrl('/images/fallback.png')
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTokenURI()
  }, [contractAddress, tokenId])

  return (
    <div className="flex flex-col items-center mt-6">
      <h3 className="font-semibold text-frogGreen mb-2">🖼️ Froggers Token #{tokenId}</h3>

      {loading && (
        <p className="text-center text-gray-500 animate-pulse text-sm">
          🔄 Token wird geladen...
        </p>
      )}

      {!loading && imageUrl && !error && (
        <img
          src={imageUrl}
          alt={`Frog Token ${tokenId}`}
          className="w-64 h-64 rounded shadow-lg border"
        />
      )}

      {!loading && error && (
        <p className="text-red-500 text-sm">
          ❌ Fehler beim Laden von Token #{tokenId}
        </p>
      )}
    </div>
  )
}