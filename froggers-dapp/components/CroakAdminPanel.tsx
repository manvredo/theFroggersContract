'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { readContract, writeContract } from '@wagmi/core'
import abi from '@/lib/abi.json'

type Props = {
  contractAddress: `0x${string}`
}

export default function CroakAdminPanel({ contractAddress }: Props) {
  const { address, isConnected } = useAccount()
  const [isOwner, setIsOwner] = useState(false)
  const [totalMinted, setTotalMinted] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [presaleActive, setPresaleActive] = useState(false)
  const [publicSaleActive, setPublicSaleActive] = useState(false)
  const [baseURI, setBaseURI] = useState('')
  const [hiddenURI, setHiddenURI] = useState('')
  const [merkleRoot, setMerkleRoot] = useState('')

  // 🔄 Lade aktuellen Contract-Status
  const loadStatus = async () => {
    try {
      const owner = await readContract({
        address: contractAddress,
        abi,
        functionName: 'owner',
      })
      setIsOwner(owner.toLowerCase() === address?.toLowerCase())

      const supply = await readContract({
        address: contractAddress,
        abi,
        functionName: 'totalSupply',
      })
      setTotalMinted(Number(supply))

      const isRevealed = await readContract({
        address: contractAddress,
        abi,
        functionName: 'revealed',
      })
      setRevealed(Boolean(isRevealed))

      const isPresale = await readContract({
        address: contractAddress,
        abi,
        functionName: 'presaleActive',
      })
      setPresaleActive(Boolean(isPresale))

      const isPublic = await readContract({
        address: contractAddress,
        abi,
        functionName: 'publicSaleActive',
      })
      setPublicSaleActive(Boolean(isPublic))
    } catch (err) {
      console.error('🔴 Fehler beim Laden des Contract-Status:', err)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      loadStatus()
    }
  }, [isConnected, address, contractAddress])

  const triggerReveal = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'reveal',
        account: address,
      })
      alert('👁️ Reveal wurde ausgelöst!')
      await loadStatus()
    } catch (err) {
      console.error('🔴 Reveal-Fehler:', err)
      alert('Fehler beim Reveal!')
    }
  }

  const updateURI = async (type: 'base' | 'hidden') => {
    const uri = type === 'base' ? baseURI : hiddenURI
    const fn = type === 'base' ? 'setBaseURI' : 'setHiddenURI'
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: fn,
        args: [uri],
        account: address,
      })
      alert(`🔗 ${fn} wurde gesetzt!`)
      await loadStatus()
    } catch (err) {
      console.error(`🔴 URI-Set-Fehler (${fn}):`, err)
      alert(`Fehler beim Setzen der ${fn}`)
    }
  }

  const updateMerkleRoot = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'setMerkleRoot',
        args: [merkleRoot],
        account: address,
      })
      alert('🌿 MerkleRoot wurde gesetzt!')
      await loadStatus()
    } catch (err) {
      console.error('🔴 MerkleRoot-Fehler:', err)
      alert('Fehler beim MerkleRoot-Setzen!')
    }
  }

  const toggleSale = async (type: 'presale' | 'public') => {
    const fn = type === 'presale' ? 'togglePresale' : 'togglePublicSale'
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: fn,
        account: address,
      })
      alert(`🔁 ${type === 'presale' ? 'Presale' : 'Public Sale'} toggled!`)
      await loadStatus()
    } catch (err) {
      console.error('🔴 Sale-Toggle-Fehler:', err)
      alert('Fehler beim Sale-Toggle!')
    }
  }

  if (!isOwner) {
    return (
      <div className="text-red-600 text-center mt-6">
        ❌ Du bist nicht der Contract Owner
      </div>
    )
  }

  return (
    <div className="bg-frogGreen text-white p-6 rounded shadow w-full max-w-md mt-6 space-y-4">
      <h3 className="text-xl font-bold text-center mb-2">🐸 Croak Admin Panel</h3>

      <p>📦 Gemintet: <strong>{totalMinted}</strong></p>
      <p>👁️ Reveal aktiv: <strong>{revealed ? '✅ Ja' : '❌ Nein'}</strong></p>
      <p>🌿 Presale aktiv: <strong>{presaleActive ? '✅ Ja' : '❌ Nein'}</strong></p>
      <p>🚀 Public Sale aktiv: <strong>{publicSaleActive ? '✅ Ja' : '❌ Nein'}</strong></p>

      <button
        onClick={triggerReveal}
        className="bg-white text-frogGreen py-2 px-4 rounded font-semibold hover:brightness-110 w-full"
      >
        👁️ Reveal auslösen
      </button>

      <div>
        <label className="block text-sm mt-4">🌐 BaseURI setzen:</label>
        <input
          type="text"
          value={baseURI}
          onChange={(e) => setBaseURI(e.target.value)}
          className="text-black w-full p-2 rounded mt-1"
          placeholder="https://ipfs.io/ipfs/..."
        />
        <button
          onClick={() => updateURI('base')}
          className="mt-2 w-full bg-white text-frogGreen py-2 rounded font-semibold hover:brightness-110"
        >
          🔗 BaseURI speichern
        </button>
      </div>

      <div>
        <label className="block text-sm mt-4">🕵️ HiddenURI setzen:</label>
        <input
          type="text"
          value={hiddenURI}
          onChange={(e) => setHiddenURI(e.target.value)}
          className="text-black w-full p-2 rounded mt-1"
          placeholder="https://ipfs.io/ipfs/hidden.json"
        />
        <button
          onClick={() => updateURI('hidden')}
          className="mt-2 w-full bg-white text-frogGreen py-2 rounded font-semibold hover:brightness-110"
        >
          🕸️ HiddenURI speichern
        </button>
      </div>

      <div>
        <label className="block text-sm mt-4">🌿 MerkleRoot setzen:</label>
        <input
          type="text"
          value={merkleRoot}
          onChange={(e) => setMerkleRoot(e.target.value)}
          className="text-black w-full p-2 rounded mt-1"
          placeholder="0x123abc..."
        />
        <button
          onClick={updateMerkleRoot}
          className="mt-2 w-full bg-white text-frogGreen py-2 rounded font-semibold hover:brightness-110"
        >
          🔒 MerkleRoot speichern
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => toggleSale('presale')}
          className="bg-white text-frogGreen py-2 px-4 rounded font-semibold w-1/2 hover:brightness-110"
        >
          🔁 Presale toggeln
        </button>
        <button
          onClick={() => toggleSale('public')}
          className="bg-white text-frogGreen py-2 px-4 rounded font-semibold w-1/2 hover:brightness-110"
        >
          🔁 Public Sale toggeln
        </button>
      </div>
    </div>
  )
}