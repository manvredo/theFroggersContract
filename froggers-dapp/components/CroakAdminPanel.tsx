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
  const [loading, setLoading] = useState(false)

  const loadStatus = async () => {
    try {
      const owner = await readContract({ address: contractAddress, abi, functionName: 'owner' })
      setIsOwner(owner.toLowerCase() === address?.toLowerCase())

      const supply = await readContract({ address: contractAddress, abi, functionName: 'totalSupply' })
      setTotalMinted(Number(supply))

      const isRevealed = await readContract({ address: contractAddress, abi, functionName: 'revealed' })
      setRevealed(Boolean(isRevealed))

      const isPresale = await readContract({ address: contractAddress, abi, functionName: 'presaleActive' })
      setPresaleActive(Boolean(isPresale))

      const isPublic = await readContract({ address: contractAddress, abi, functionName: 'publicSaleActive' })
      setPublicSaleActive(Boolean(isPublic))
    } catch (err) {
      console.error('[AdminPanel] 🔴 Status-Fehler:', err)
    }
  }

  useEffect(() => {
    if (isConnected && address) loadStatus()
  }, [isConnected, address, contractAddress])

  const triggerReveal = async () => {
    setLoading(true)
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'reveal',
        account: address,
        // gasLimit: 100_000 // optional
      })
      alert('👁️ Reveal wurde ausgelöst!')
      setRevealed(true)
      await loadStatus()
    } catch (err) {
      console.error('[AdminPanel] 🔴 Reveal-Fehler:', err)
      alert('Fehler beim Reveal!')
    } finally {
      setLoading(false)
    }
  }

  const updateURI = async (type: 'base' | 'hidden') => {
    const uri = type === 'base' ? baseURI : hiddenURI
    const fn = type === 'base' ? 'setBaseURI' : 'setHiddenURI'
    setLoading(true)
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: fn,
        args: [uri],
        account: address
      })
      alert(`🔗 ${fn} erfolgreich gesetzt!`)
      // localStorage.setItem(fn, uri) // optional persistieren
      await loadStatus()
    } catch (err) {
      console.error(`[AdminPanel] 🔴 ${fn}-Fehler:`, err)
      alert(`Fehler beim Setzen von ${fn}`)
    } finally {
      setLoading(false)
    }
  }

  const updateMerkleRoot = async () => {
    setLoading(true)
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'setMerkleRoot',
        args: [merkleRoot],
        account: address
      })
      alert('🌿 MerkleRoot gesetzt!')
      await loadStatus()
    } catch (err) {
      console.error('[AdminPanel] 🔴 MerkleRoot-Fehler:', err)
      alert('Fehler beim MerkleRoot-Setzen!')
    } finally {
      setLoading(false)
    }
  }

  const toggleSale = async (type: 'presale' | 'public') => {
    const fn = type === 'presale' ? 'togglePresale' : 'togglePublicSale'
    setLoading(true)
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: fn,
        account: address
      })
      alert(`🔁 ${type === 'presale' ? 'Presale' : 'Public Sale'} getoggelt!`)
      await loadStatus()
    } catch (err) {
      console.error('[AdminPanel] 🔴 Sale-Toggle-Fehler:', err)
      alert('Fehler beim Sale-Toggle!')
    } finally {
      setLoading(false)
    }
  }

  if (!isOwner) {
    return (
      <div className="text-red-600 text-center mt-6">
        ❌ Kein Zugriff: Du bist nicht der Contract-Owner
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
        disabled={loading}
        className={`py-2 px-4 rounded w-full font-semibold ${loading ? 'opacity-50' : 'bg-white text-frogGreen hover:brightness-110'}`}
      >
        👁️ Reveal auslösen
      </button>

      {/* Base URI */}
      <div>
        <label className="block text-sm mt-4">🌐 BaseURI:</label>
        <input
          type="text"
          value={baseURI}
          onChange={(e) => setBaseURI(e.target.value)}
          className="text-black w-full p-2 rounded mt-1"
          placeholder="https://ipfs.io/ipfs/..."
        />
        <button
          onClick={() => updateURI('base')}
          disabled={loading}
          className={`mt-2 w-full py-2 rounded font-semibold ${loading ? 'opacity-50' : 'bg-white text-frogGreen hover:brightness-110'}`}
        >
          🔗 BaseURI speichern
        </button>
      </div>

      {/* Hidden URI */}
      <div>
        <label className="block text-sm mt-4">🕵️ HiddenURI:</label>
        <input
          type="text"
          value={hiddenURI}
          onChange={(e) => setHiddenURI(e.target.value)}
          className="text-black w-full p-2 rounded mt-1"
          placeholder="https://ipfs.io/ipfs/hidden.json"
        />
        <button
          onClick={() => updateURI('hidden')}
          disabled={loading}
          className={`mt-2 w-full py-2 rounded font-semibold ${loading ? 'opacity-50' : 'bg-white text-frogGreen hover:brightness-110'}`}
        >
          🕸️ HiddenURI speichern
        </button>
      </div>

      {/* Merkle Root */}
      <div>
        <label className="block text-sm mt-4">🌿 MerkleRoot:</label>
        <input
          type="text"
          value={merkleRoot}
          onChange={(e) => setMerkleRoot(e.target.value)}
          className="text-black w-full p-2 rounded mt-1"
          placeholder="0x123abc..."
        />
        <button
          onClick={updateMerkleRoot}
          disabled={loading}
          className={`mt-2 w-full py-2 rounded font-semibold ${loading ? 'opacity-50' : 'bg-white text-frogGreen hover:brightness-110'}`}
        >
          🔒 MerkleRoot speichern
        </button>
      </div>

      {/* Sale Toggles */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => toggleSale('presale')}
          disabled={loading}
          className={`py-2 px-4 rounded font-semibold w-1/2 ${loading ? 'opacity-50' : 'bg-white text-frogGreen hover:brightness-110'}`}
        >
          🔁 Presale toggeln
        </button>
        <button