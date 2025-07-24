'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { readContract, writeContract } from '@wagmi/core'
import abi from '@/lib/abi.json'
import FroggersViewer from '@/components/FroggersViewer'
import { getProofForAddress } from '@/utils/getMerkleProof'

type SalePhase = 'presale' | 'public'

export default function Home() {
  const contractAddress = '0x85abcDEF1234567890abcDEF1234567890abcDEF'
  const { address, isConnected } = useAccount()
  const { writeContract, isPending, error } = useWriteContract()

  const [quantity, setQuantity] = useState(1)
  const [minted, setMinted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const [totalMinted, setTotalMinted] = useState(0)
  const [presaleActive, setPresaleActive] = useState(false)
  const [publicSaleActive, setPublicSaleActive] = useState(false)
  const [baseURI, setBaseURI] = useState('')
  const [hiddenURI, setHiddenURI] = useState('')
  const [merkleRoot, setMerkleRoot] = useState('')

  const salePhase: SalePhase = 'presale'
  const proof = address ? getProofForAddress(address) ?? [] : []
  const whitelisted = proof.length > 0

  // 🔎 Contract Status laden
  useEffect(() => {
    const fetchStatus = async () => {
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
        console.error('🛠️ Contract Status Fehler:', err)
      }
    }

    if (isConnected) fetchStatus()
  }, [isConnected, address, contractAddress])

  // 🐸 Mint-Funktion
  const handleMint = async () => {
    const args = salePhase === 'presale' ? [quantity, proof] : [quantity]
    const functionName = salePhase === 'presale' ? 'presaleMint' : 'publicMint'

    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
        account: address,
      })
      setMinted(true)
    } catch (err) {
      console.error('Croak-Fail beim Mint:', err)
    }
  }

  // 🔧 Admin-Aktionen
  const triggerReveal = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'reveal',
        args: [],
        account: address,
      })
      alert('👁️ Reveal wurde ausgelöst!')
      setRevealed(true)
    } catch (err) {
      console.error('Croak-Reveal Error:', err)
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
      alert(`${type === 'base' ? 'BaseURI' : 'HiddenURI'} gespeichert`)
    } catch (err) {
      console.error('Croak URI Error:', err)
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
      alert('🌿 MerkleRoot gesetzt')
    } catch (err) {
      console.error('Croak MerkleRoot Error:', err)
    }
  }

  const toggleSale = async (type: 'presale' | 'public') => {
    const fn = type === 'presale' ? 'togglePresale' : 'togglePublicSale'
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: fn,
        args: [type === 'presale' ? !presaleActive : !publicSaleActive],
        account: address,
      })
      type === 'presale'
        ? setPresaleActive((prev) => !prev)
        : setPublicSaleActive((prev) => !prev)
    } catch (err) {
      console.error('Croak SaleToggle Error:', err)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-glibberGray text-white font-sans">
      <h1 className="text-4xl font-bold text-frogGreen mb-6">
        🐸 Froggers Mint Dapp
      </h1>

      {/* 🐸 Mint-Bereich */}
      <div className="bg-white text-glibberGray p-6 rounded shadow w-full max-w-md mb-8">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium">🔍 Whitelist-Status:</p>
          {!isConnected && <p className="text-gray-500">Wallet nicht verbunden</p>}
          {isConnected && whitelisted && <p className="text-green-600 font-semibold">✅ Du bist whitelisted!</p>}
          {isConnected && !whitelisted && <p className="text-red-600 font-semibold">❌ Du bist nicht auf der Liste</p>}
        </div>

        <label className="text-sm font-medium">🐸 Anzahl Froggers:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full text-center p-2 border rounded mt-2 mb-4"
        />
        <button
          onClick={handleMint}
          disabled={isPending || !whitelisted}
          className="w-full bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
        >
          {salePhase === 'presale' ? '🌿 Presale Mint starten' : '🚀 Public Mint starten'}
        </button>

        {error && <p className="text-red-500 text-sm font-mono text-center mt-4">Croak-Error: {error.message}</p>}

        {minted && (
          <div className="mt-6 text-center space-y-4">
            <p className="text-frogGreen font-semibold">✅ Mint erfolgreich!</p>
            <p className="text-white text-sm">🎉 Du besitzt jetzt {quantity} Frogger{quantity > 1 ? 's' : ''} — willkommen im Teich!</p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Ich habe gerade ${quantity} 🐸 Froggers gemintet! Croak loud ➡️ https://froggers.xyz`
              )
			  
			  }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:brightness-110"
            >
              🐦 Teile deinen Frog auf Twitter!
            </a>
            {revealed ? (
              <p className="text-green-500 font-semibold">👁️ Reveal ist aktiv!</p>
            ) : (
              <button
                onClick={() => alert('👁️ Reveal ist noch nicht aktiviert. Die Froggers glibbern noch unter der Oberfläche!')}
                className="inline-block bg-frogGreen text-white px-4 py-2 rounded hover:brightness-110"
              >
                👁️ Reveal prüfen
              </button>
            )}
          </div>
        )}
      </div> 	
		
		{minted && isConnected && (
  <FroggersViewer contractAddress={contractAddress} />
)}


// 🛠️ Croak Admin Panel
{isConnected && isOwner && (
  <div className="bg-frogGreen text-white p-6 rounded shadow w-full max-w-md mt-8 space-y-4">
    <h3 className="text-xl font-bold text-center mb-2">🐸 Croak Admin Panel</h3>

    <p>👑 Du bist Contract Owner</p>
    <p>📦 Gemintet: {totalMinted}</p>
    <p>👁️ Reveal aktiv: {revealed ? '✅ Ja' : '❌ Nein'}</p>
    <p>🌿 Presale aktiv: {presaleActive ? '✅ Ja' : '❌ Nein'}</p>
    <p>🚀 Public Sale aktiv: {publicSaleActive ? '✅ Ja' : '❌ Nein'}</p>

    <button
      onClick={triggerReveal}
      className="w-full bg-white text-frogGreen py-2 rounded font-semibold hover:brightness-110"
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
        placeholder="0xabc..."
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
        className="w-1/2 bg-white text-frogGreen py-2 rounded font-semibold hover:brightness-110"
      >
          🔁 Presale toggeln
      </button>
      <button
        onClick={() => toggleSale('public')}
        className="w-1/2 bg-white text-frogGreen py-2 rounded font-semibold hover:brightness-110"
      >
        🔁 Public Sale toggeln
      </button>
    </div>
  </div>
)}
</main>
  )
}

