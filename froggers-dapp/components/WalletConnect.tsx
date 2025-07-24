'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnect } = useDisconnect()

  const injected = connectors.find(c => c.name === 'Injected')

  const handleConnect = async () => {
    if (!injected) return
    try {
      await connectAsync({ connector: injected })
    } catch (err) {
      console.error('Wallet-Verbindung fehlgeschlagen:', err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded bg-white text-glibberGray shadow-lg">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110"
        >
          🦊 Wallet verbinden
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-sm mb-2">Verbunden mit:</p>
          <p className="text-md font-mono text-frogGreen">{address}</p>
          <button
            onClick={() => disconnect()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:brightness-110"
          >
            🛑 Trennen
          </button>
        </div>
      )}
    </div>
  )
}



