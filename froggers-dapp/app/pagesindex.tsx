'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { injected } from '@wagmi/connectors'

import FroggersViewer from '@/components/FroggersViewer'
import MintControls from '@/components/MintControls'
import { getProofForAddress } from '@/utils/getMerkleProof'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, isLoading: connectLoading } = useConnect()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  const userProof = isConnected ? getProofForAddress(address) : []

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🐸 Froggers NFT Minting</h1>

      {isClient && !isConnected ? (
        <div>
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={connectLoading}
            className="btn-primary mb-2"
          >
            {connectLoading ? '🔄 Verbinde...' : '🔐 Mit MetaMask verbinden'}
          </button>
        </div>
      ) : (
        <>
          <MintControls />
          <FroggersViewer userProof={userProof} />
        </>
      )}
    </main>
  )
}
