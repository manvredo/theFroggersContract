import { useState } from 'react'
import {
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther } from 'viem'
import abi from '@/lib/abi.json'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export function usePublicMint() {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState('')

  const {
    write,
    isLoading: sending,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'publicMint',
    onSuccess(data) {
      console.log('[PublicMint] 🟢 TX Hash:', data.hash)
      setTxHash(data.hash)
    },
    onError(err) {
      console.error('[PublicMint] ❌ TX Fehler:', err)
      setError(err.message || 'Public mint failed to send')
    },
  })

  const {
    isLoading: waiting,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    onError(err) {
      console.error('[PublicMint] ❌ TX Receipt Fehler:', err)
      setError(err.message || 'Transaction confirmation failed')
    },
  })

  function mint(quantity: number) {
    if (quantity <= 0) {
      setError('🚫 Ungültige Mint-Menge')
      return
    }

    setError('')
    setTxHash(null)

    write?.({
      args: [quantity],
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