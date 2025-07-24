'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import abi from '@/lib/abi.json'

export default function FroggersViewer({
  contractAddress,
}: {
  contractAddress: `0x${string}`
}) {
  const { address } = useAccount()
  const [tokenIds, setTokenIds] = useState<number[]>([])
  const [tokenData, setTokenData] = useState<
    { id: number; image: string; name: string; traits: any[] }[]
  >([])

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'balanceOf',
    args: [address],
    account: address,
  })

  useEffect(() => {
    if (!balance || typeof balance !== 'bigint') return
    const ids = Array.from({ length: Number(balance) }, (_, i) => i)
    setTokenIds(ids)
  }, [balance])

  useEffect(() => {
    const fetchTokenData = async () => {
      const items = await Promise.all(
        tokenIds.map(async (id) => {
          try {
            const res = await fetch(
              `/api/token-uri?contract=${contractAddress}&id=${id}`
            )
            const meta = await res.json()
            return {
              id,
              image: meta.image ?? '/fallback.png',
              name: meta.name ?? `Frogger #${id}`,
              traits: meta.attributes ?? [],
            }
          } catch {
            return {
              id,
              image: '/fallback.png',
              name: `Frogger #${id}`,
              traits: [],
            }
          }
        })
      )
      setTokenData(items)
    }

    if (tokenIds.length > 0) fetchTokenData()
  }, [tokenIds, contractAddress])

  return (
    <div className="mt-10 w-full">
      <h2 className="text-2xl font-bold text-center text-frogGreen mb-4">
        🖼️ Deine Froggers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tokenData.map(({ id, image, name, traits }) => (
          <div key={id} className="bg-white p-4 rounded shadow text-center">
            <img
              src={image}
              alt={name}
              className="w-full h-auto mb-2 rounded border"
            />
            <p className="text-sm font-semibold mb-1">{name}</p>

            {traits.length > 0 && (
              <ul className="text-xs text-left mb-2">
                {traits.map((trait, i) => (
                  <li key={i}>
                    • {trait.trait_type}: {trait.value}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-center gap-2 text-xs">
              <a
                href={`https://sepolia.etherscan.io/token/${contractAddress}?a=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Etherscan
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                OpenSea
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
