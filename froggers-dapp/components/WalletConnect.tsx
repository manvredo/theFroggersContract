'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnect } = useDisconnect()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const injected = connectors.find(c => c.name === 'Injected')

  const handleConnect = async () => {
    if (!injected) {
      setError('🛠️ Kein Injected Connector gefunden.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await connectAsync({ connector: injected })
    } catch (err) {
      console.error('Wallet-Verbindung fehlgeschlagen:', err)
      setError('❌ Verbindung fehlgeschlagen. Versuch es erneut!')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setError('')
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded bg-white text-glibberGray shadow-lg">
      {!isConnected ? (
        <>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Croaking...' : '🦊 Wallet verbinden'}
          </button>
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-sm mb-2">Verbunden mit:</p>
          <p className="text-md font-mono text-frogGreen">{address}</p>
          <button
            onClick={handleDisconnect}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:brightness-110"
          >
            🛑 Trennen
          </button>
        </div>
      )}
    </div>
  )
}