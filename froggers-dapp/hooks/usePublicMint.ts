import { useState } from 'react'
import {
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther } from 'viem'
import abi from '@/lib/abi.json'

const contractAddress = '0xYourContractAddress'

export function usePublicMint() {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { write, isLoading: sending } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'publicMint',
    onSuccess(data) {
      setTxHash(data.hash)
    },
    onError(err) {
      setError(err.message || 'Public mint failed to send')
    },
  })

  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    onError(err) {
      setError(err.message || 'Transaction failed during confirmation')
    },
  })

  function mint(quantity: number) {
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
