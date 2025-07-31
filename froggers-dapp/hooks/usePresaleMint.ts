import { useState } from 'react'
import {
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther } from 'viem'
import abi from '@/lib/abi.json'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export function usePresaleMint() {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState('')

  const {
    write,
    isLoading: sending,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'presaleMint',
    onSuccess(data) {
      console.log('[PresaleMint] 🟢 TX gesendet:', data.hash)
      setTxHash(data.hash)
    },
    onError(err) {
      console.error('[PresaleMint] ❌ TX Fehler:', err)
      setError(err.message || 'Presale mint failed to send')
    },
  })

  const {
    isLoading: waiting,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    onError(err) {
      console.error('[PresaleMint] ❌ TX Receipt Fehler:', err)
      setError(err.message || 'Transaction failed during confirmation')
    },
  })

  function mint(quantity: number, proof: `0x${string}`[]) {
    if (quantity <= 0) {
      setError('🚫 Ungültige Mint-Menge')
      return
    }

    if (!proof || proof.length === 0) {
      setError('🚫 Kein gültiger Merkle-Proof gefunden')
      return
    }

    setError('')
    setTxHash(null)

    write?.({
      args: [quantity, proof],
      value: parseEther((0.01 * quantity).toString()),
    })
  }

  return {
    mint,
    loading: sending || waiting,
    success: isSuccess,
    error,
  }
}