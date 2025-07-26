'use client'

import { useState } from 'react'
import {
  useAccount,
  useConnect,
  useConnectorClient,
  useWriteContract,
} from 'wagmi'
import abi from '@/lib/abi.json'

type SalePhase = 'presale' | 'public'

export default function MintButton({
  contractAddress,
}: {
  contractAddress: `0x${string}`
}) {
  const { address, isConnected, connector } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { data: connectorClient } = useConnectorClient()
  const { writeContract, isPending, error } = useWriteContract()

  const [quantity, setQuantity] = useState(1)
  const [minted, setMinted] = useState(false)
  const [salePhase, setSalePhase] = useState<SalePhase>('presale')

  // 🧬 Dummy-Proof fürs Presale (nur zum Debuggen!)
  const dummyProof: `0x${string}`[] = [
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
  ]

  const togglePhase = () => {
    setSalePhase(prev => (prev === 'presale' ? 'public' : 'presale'))
  }

  const handleMint = async () => {
    if (!isConnected || !connector || !connectorClient) {
      alert('Wallet nicht vollständig verbunden. Bitte neu verbinden 🦊')
      const injected = connectors.find(c => c.name === 'Injected')
      if (!injected) {
        alert('Kein Injected Connector verfügbar.')
        return
      }
      await connectAsync({ connector: injected })
    }

    console.log('--- MintFlow DEBUG ---')
    console.log('isConnected:', isConnected)
    console.log('address:', address)
    console.log('salePhase:', salePhase)

    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: salePhase === 'presale' ? 'presaleMint' : 'publicMint',
        args: salePhase === 'presale'
          ? [quantity, dummyProof]
          : [quantity],
        value: BigInt("10000000000000000"), // z. B. 0.01 ETH
        account: address,
        connector,
      })
      setMinted(true)
    } catch (err) {
      console.error('Croak-Fail beim Mint:', err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 border rounded bg-white text-glibberGray shadow-lg">
      <div className="w-full text-sm text-left">
        🔍 <strong>Status-Check:</strong><br />
        • Phase: {salePhase === 'presale' ? '🌿 Presale' : '🚀 Public'}<br />
        • Connected: {isConnected ? '✅ Ja' : '❌ Nein'}<br />
        • Connector: {connector ? connector.name : '❌'}<br />
        • Client: {connectorClient ? '✅ Bereit' : '❌ Nicht geladen'}
      </div>

      <button onClick={togglePhase} className="bg-sky-200 text-black px-4 py-2 rounded hover:brightness-105">
        🔄 Phase wechseln → Jetzt: {salePhase === 'presale' ? 'Presale' : 'Public'}
      </button>

      {!minted ? (
        <>
          <label className="text-sm font-medium mt-2">🐸 Anzahl Froggers:</label>
          <input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 text-center p-2 border rounded"
          />
          <button
            onClick={handleMint}
            disabled={isPending || !isConnected || !connectorClient}
            className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50 mt-2"
          >
            {salePhase === 'presale'
              ? '🌿 Presale Mint starten'
              : '🚀 Public Mint starten'}
          </button>
        </>
      ) : (
        <p className="text-center text-lg text-frogGreen mt-2">✅ Mint erfolgreich!</p>
      )}

      {error && (
        <p className="text-red-500 text-sm font-mono text-center mt-2">
          Croak-Error: {error.message}
        </p>
      )}
    </div>
  )
}
