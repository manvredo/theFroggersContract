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

  useEffect(() => {
    const fetchTokenURI = async () => {
      try {
        const uri = await readContract({
          address: contractAddress,
          abi,
          functionName: 'tokenURI',
          args: [tokenId],
        })

        const response = await fetch(uri as string)
        const metadata = await response.json()
        setImageUrl(metadata.image)
      } catch (err) {
        console.error('🧪 TokenPreview Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTokenURI()
  }, [contractAddress, tokenId])

  if (loading) return <p className="text-center text-sm">🔄 Loading token preview...</p>

  return (
    <div className="flex flex-col items-center mt-6">
      <h3 className="font-semibold text-frogGreen mb-2">🖼️ Froggers Token #{tokenId}</h3>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Frog Token ${tokenId}`}
          className="w-64 h-64 rounded shadow-lg border"
        />
      ) : (
        <p className="text-red-500">❌ Bild nicht gefunden</p>
      )}
    </div>
  )
}

