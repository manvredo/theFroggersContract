'use client'

import { useState, useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useContractWrite,
} from 'wagmi'
import { injected } from '@wagmi/connectors'
import { readContract } from '@wagmi/core'

import abi from '@/lib/abi.json'
import FroggersViewer from '@/components/FroggersViewer'
import { getProofForAddress } from '@/utils/getMerkleProof'

export default function Home() {
  const [merkleRoot, setMerkleRoot] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [presaleActive, setPresaleActive] = useState(false)
  const [publicSaleActive, setPublicSaleActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)

  const { address, isConnected, chain } = useAccount()
  const chainId = chain?.id

  const {
    connect,
    isLoading: connectLoading,
  } = useConnect()

  const { writeAsync: writeToggleSale } = useContractWrite({
    address: '0xYourContractAddress', // 🔧 Replace with your actual contract
    abi,
    functionName: 'toggleSale',
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!chainId) return

    const fetchMerkleRoot = async () => {
      try {
        const root = await readContract({
          address: '0xYourContractAddress',
          abi,
          functionName: 'merkleRoot',
          chainId,
        })
        setMerkleRoot(root as string)
      } catch (err) {
        console.error(err)
        setError('Fehler beim Laden des Merkle Roots')
      }
    }

    const fetchStatus = async () => {
      try {
        const [revealedStatus, presaleStatus, publicSaleStatus] = await Promise.all([
          readContract({ address: '0xYourContractAddress', abi, functionName: 'revealed', chainId }),
          readContract({ address: '0xYourContractAddress', abi, functionName: 'presaleActive', chainId }),
          readContract({ address: '0xYourContractAddress', abi, functionName: 'publicSaleActive', chainId }),
        ])

        setRevealed(Boolean(revealedStatus))
        setPresaleActive(Boolean(presaleStatus))
        setPublicSaleActive(Boolean(publicSaleStatus))
      } catch (err) {
        console.error(err)
        setError('Fehler beim Laden des Verkaufsstatus')
      }
    }

    fetchMerkleRoot()
    fetchStatus()
  }, [chainId])

  async function toggleSale(saleType: 'presale' | 'publicSale') {
    setLoading(true)
    setError('')
    try {
      await writeToggleSale({ args: [saleType] })
      saleType === 'presale'
        ? setPresaleActive((prev) => !prev)
        : setPublicSaleActive((prev) => !prev)
    } catch (err) {
      console.error(err)
      setError('Fehler beim Umschalten des Verkaufsstatus')
    } finally {
      setLoading(false)
    }
  }

  const userProof = isConnected ? getProofForAddress(address) : []

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🐸 Froggers NFT Minting</h1>

      {!isConnected ? (
        <div>
          <h2 className="mb-2">🔐 Wallet verbinden</h2>
          {isClient && (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={connectLoading}
              className="btn-primary mb-2"
            >
              {connectLoading ? '🔄 Verbinde...' : '🔐 Mit MetaMask verbinden'}
            </button>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      ) : (
        <div>
          <p>👤 Verbunden als: {address}</p>

          <div className="my-4 space-y-1">
            <p>🌿 Merkle Root: {merkleRoot}</p>
            <p>👁️ Reveal aktiv: {revealed ? '✅ Ja' : '❌ Nein'}</p>
            <p>🌿 Presale aktiv: {presaleActive ? '✅ Ja' : '❌ Nein'}</p>
            <p>🚀 Public Sale aktiv: {publicSaleActive ? '✅ Ja' : '❌ Nein'}</p>
          </div>

          <div className="flex gap-2 my-4">
            <button
              onClick={() => toggleSale('presale')}
              disabled={loading}
              className="w-1/2 bg-white text-green-600 py-2 rounded font-semibold"
            >
              🔁 Presale umschalten
            </button>
            <button
              onClick={() => toggleSale('publicSale')}
              disabled={loading}
              className="w-1/2 bg-white text-green-600 py-2 rounded font-semibold"
            >
              🔁 Public Sale umschalten
            </button>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <FroggersViewer merkleRoot={merkleRoot} userProof={userProof} />
        </div>
      )}
    </main>
  )
}
