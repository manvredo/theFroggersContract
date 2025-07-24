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
  salePhase = 'presale',
  proof = [],
}: {
  contractAddress: `0x${string}`
  salePhase?: SalePhase
  proof?: string[]
}) {
  const { address, isConnected, connector } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { data: connectorClient } = useConnectorClient()
  const { writeContract, isPending, error } = useWriteContract()

  const [quantity, setQuantity] = useState(1)
  const [minted, setMinted] = useState(false)

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

    // 🧪 Extra Logging — direkt vor dem Mint
    console.log('--- MintFlow DEBUG ---')
    console.log('isConnected:', isConnected)
    console.log('address:', address)
    console.log('connector:', connector)
    console.log('connectorClient:', connectorClient)
    console.log('salePhase:', salePhase)
    console.log('args:', salePhase === 'presale' ? [quantity, proof] : [quantity])

    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: salePhase === 'presale' ? 'presaleMint' : 'publicMint',
        args: salePhase === 'presale' ? [quantity, proof] : [quantity],
        account: address,
        connector, // ✅ client entfernt!
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
        • Connected: {isConnected ? '✅ Ja' : '❌ Nein'}<br />
        • Connector: {connector ? connector.name : '❌'}<br />
        • Client: {connectorClient ? '✅ Bereit' : '❌ Nicht geladen'}
      </div>

      {!minted ? (
        <>
          <label className="text-sm font-medium">🐸 Anzahl Froggers:</label>
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
        <p className="text-center text-lg text-frogGreen">✅ Mint erfolgreich!</p>
      )}

      {error && (
        <p className="text-red-500 text-sm font-mono text-center mt-2">
          Croak-Error: {error.message}
        </p>
      )}
    </div>
  )
}
