import { useEffect, useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'
import { readContract } from '@wagmi/core'
import abi from '@/lib/abi.json'

export function useSaleToggle() {
  const { address, isConnected, chain } = useAccount()
  const chainId = chain?.id
  const contractAddress = '0xYourContractAddress'

  const [merkleRoot, setMerkleRoot] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [presaleActive, setPresaleActive] = useState(false)
  const [publicSaleActive, setPublicSaleActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const togglePresaleHook = useContractWrite({ address: contractAddress, abi, functionName: 'togglePresale' })
  const togglePublicSaleHook = useContractWrite({ address: contractAddress, abi, functionName: 'togglePublicSale' })

  useEffect(() => {
    if (!chainId) return
    const loadData = async () => {
      try {
        const [root, revealedStatus, presaleStatus, publicSaleStatus] = await Promise.all([
          readContract({ address: contractAddress, abi, functionName: 'merkleRoot', chainId }),
          readContract({ address: contractAddress, abi, functionName: 'revealed', chainId }),
          readContract({ address: contractAddress, abi, functionName: 'presaleActive', chainId }),
          readContract({ address: contractAddress, abi, functionName: 'publicSaleActive', chainId }),
        ])
        setMerkleRoot(root as string)
        setRevealed(Boolean(revealedStatus))
        setPresaleActive(Boolean(presaleStatus))
        setPublicSaleActive(Boolean(publicSaleStatus))
      } catch (err) {
        setError('Fehler beim Laden der Contract-Daten')
      }
    }

    loadData()
  }, [chainId])

  async function toggleSale(saleType: 'presale' | 'publicSale') {
    setLoading(true)
    setError('')
    try {
      if (!isConnected) throw new Error('Wallet nicht verbunden')
      const writeAsync =
        saleType === 'presale' ? togglePresaleHook.writeAsync : togglePublicSaleHook.writeAsync

      const tx = await writeAsync()
      await tx.wait()
      if (saleType === 'presale') setPresaleActive(prev => !prev)
      else setPublicSaleActive(prev => !prev)
    } catch (err: any) {
      if (err.code === 4001) setError('Benutzer hat die Transaction abgebrochen')
      else if (err.message?.includes('onlyOwner')) setError('Nur der Owner darf das!')
      else setError(err.message || 'Fehler beim Umschalten')
    } finally {
      setLoading(false)
    }
  }

  return {
    address,
    merkleRoot,
    revealed,
    presaleActive,
    publicSaleActive,
    error,
    loading,
    toggleSale,
  }
}
