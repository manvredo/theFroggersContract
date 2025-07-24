'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import abi from '@/lib/abi.json'
import FroggersViewer from '@/components/FroggersViewer'
import { getProofForAddress } from '@/utils/getMerkleProof'

type SalePhase = 'presale' | 'public'

export default function Home() {
  const contractAddress = '0x85abcDEF1234567890abcDEF1234567890abcDEF'
  const { address, isConnected } = useAccount()
  const { writeContract, isPending, error } = useWriteContract()

  const [quantity, setQuantity] = useState(1)
  const [minted, setMinted] = useState(false)

  const salePhase: SalePhase = 'presale'
  const proof = address ? getProofForAddress(address) ?? [] : []

  const whitelisted = proof.length > 0

  const handleMint = async () => {
    const args = salePhase === 'presale' ? [quantity, proof] : [quantity]
    const functionName = salePhase === 'presale' ? 'presaleMint' : 'publicMint'

    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
        account: address,
      })
      setMinted(true)
    } catch (err) {
      console.error('Croak-Fail beim Mint:', err)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-glibberGray text-white font-sans">
      <h1 className="text-4xl font-bold text-frogGreen mb-6">
        🐸 Froggers Mint Dapp
      </h1>

      <div className="bg-white text-glibberGray p-6 rounded shadow w-full max-w-md mb-8">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium">🔍 Whitelist-Status:</p>
          {!isConnected && (
            <p className="text-gray-500">Wallet nicht verbunden</p>
          )}
          {isConnected && whitelisted && (
            <p className="text-green-600 font-semibold">✅ Du bist whitelisted!</p>
          )}
          {isConnected && !whitelisted && (
            <p className="text-red-600 font-semibold">❌ Du bist nicht auf der Liste</p>
          )}
        </div>

        <label className="text-sm font-medium">🐸 Anzahl Froggers:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full text-center p-2 border rounded mt-2 mb-4"
        />
        <button
          onClick={handleMint}
          disabled={isPending || !whitelisted}
          className="w-full bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
        >
          {salePhase === 'presale'
            ? '🌿 Presale Mint starten'
            : '🚀 Public Mint starten'}
        </button>
        {error && (
          <p className="text-red-500 text-sm font-mono text-center mt-4">
            Croak-Error: {error.message}
          </p>
        )}
        {minted && (
          <p className="text-center text-frogGreen mt-4 font-semibold">
            ✅ Mint erfolgreich!
          </p>
        )}
      </div>

      {minted && isConnected && (
        <FroggersViewer contractAddress={contractAddress} />
      )}
    </main>
  )
}
