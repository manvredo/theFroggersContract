import { useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import abi from '@/lib/abi.json'

const contractAddress = '0xYourContractAddress'

export function useSaleToggle() {
  const { address } = useAccount()
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [activeSale, setActiveSale] = useState<'presale' | 'publicSale' | null>(null)

  // 🔁 Live sale status from contract
  const { data: presaleActive = false } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'presaleActive',
  })

  const { data: publicSaleActive = false } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'publicSaleActive',
  })

  const { data: revealed = false } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'isRevealed',
  })

  const { data: merkleRoot = '' } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'merkleRoot',
  })

  // 📝 Contract write: Toggle Presale
  const { write: togglePresale, isLoading: sendingPresale } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'togglePresale',
    onSuccess(data) {
      setTxHash(data.hash)
      setActiveSale('presale')
    },
    onError(err) {
      setError(err.message || 'Presale toggle failed')
    },
  })

  // 📝 Contract write: Toggle Public Sale
  const { write: togglePublicSale, isLoading: sendingPublic } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'togglePublicSale',
    onSuccess(data) {
      setTxHash(data.hash)
      setActiveSale('publicSale')
    },
    onError(err) {
      setError(err.message || 'Public Sale toggle failed')
    },
  })

  // ⏳ Wait for TX confirmation
  const {
    isLoading: waitingTx,
    isSuccess,
    isError: txFailed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess() {
      console.log(`✅ ${activeSale} toggled successfully`)
    },
    onError(err) {
      setError(err.message || 'Transaction failed during confirmation')
    },
  })

  // 🕹️ Toggle trigger
  function toggleSale(type: 'presale' | 'publicSale') {
    setError('')
    setTxHash(null)

    if (type === 'presale') {
      togglePresale?.()
    }
    if (type === 'publicSale') {
      togglePublicSale?.()
    }
  }

  return {
    address,
    merkleRoot,
    revealed,
    presaleActive,
    publicSaleActive,
    error,
    loading: sendingPresale || sendingPublic || waitingTx,
    success: isSuccess,
    toggleSale,
  }
}
