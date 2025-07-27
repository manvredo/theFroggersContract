import { useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import abi from '@/lib/abi.json'

const contractAddress = '0x31d57EDE517E027C2125B5Db8c54d28Db5ea0615' // Deine aktuelle Contract-Adresse

export function useSaleToggle() {
  const { address } = useAccount()
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [activeSale, setActiveSale] = useState<'presale' | 'publicSale' | null>(null)

  // 🔁 Live sale status mit watch:true
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

  const { data: paused = true } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'paused',
    watch: true,
  })

  // 📝 Toggle Presale
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

  // 📝 Toggle Public Sale
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

  // ⏳ Transaktion bestätigen
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
      console.log('→ Toggle Presale pressed')
      togglePresale?.()
    }

    if (type === 'publicSale') {
      console.log('→ Toggle Public Sale pressed')
      togglePublicSale?.()
    }
  }

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