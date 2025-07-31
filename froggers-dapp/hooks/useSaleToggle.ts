import { useState, useCallback } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import abi from '@/lib/abi.json'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export function useSaleToggle() {
  const { address } = useAccount()
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [activeSale, setActiveSale] = useState<'presale' | 'publicSale' | null>(null)

  // 🔁 Status-Reader
  const { data: presaleActive = false } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'presaleActive',
    watch: true,
  })

  const { data: publicSaleActive = false } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'publicSaleActive',
    watch: true,
  })

  const { data: paused = false } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'paused',
    watch: true,
  })

  // 🔀 Toggle-Funktionen
  const { write: togglePresale, isLoading: sendingPresale } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'togglePresale',
    onSuccess(data) {
      console.log('[Toggle] Presale TX:', data.hash)
      setTxHash(data.hash)
      setActiveSale('presale')
    },
    onError(err) {
      console.error('[Toggle] Presale Fehler:', err)
      setError(err.message || 'Presale toggle failed')
    },
  })

  const { write: togglePublicSale, isLoading: sendingPublic } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'togglePublicSale',
    onSuccess(data) {
      console.log('[Toggle] Public Sale TX:', data.hash)
      setTxHash(data.hash)
      setActiveSale('publicSale')
    },
    onError(err) {
      console.error('[Toggle] Public Sale Fehler:', err)
      setError(err.message || 'Public Sale toggle failed')
    },
  })

  const {
    isLoading: waitingTx,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess() {
      console.log(`[Toggle] ✅ ${activeSale} erfolgreich aktiviert`)
      // Optional: auto-refresh logic hier oder Toast auslösen
    },
    onError(err) {
      console.error('[Toggle] TX Receipt Fehler:', err)
      setError(err.message || 'Toggle-Transaction failed')
    },
  })

  // 🕹️ Ausgelöstes Toggle
  const toggleSale = useCallback((type: 'presale' | 'publicSale') => {
    setError('')
    setTxHash(null)

    if (type === 'presale') {
      console.log('→ 🟢 Presale toggle triggered')
      togglePresale?.()
    }

    if (type === 'publicSale') {
      console.log('→ 🟣 Public Sale toggle triggered')
      togglePublicSale?.()
    }
  }, [togglePresale, togglePublicSale])

  return {
    address,
    presaleActive,
    publicSaleActive,
    paused,
    error,
    loading: sendingPresale || sendingPublic || waitingTx,
    success: isSuccess,
    toggleSale,
  }
}