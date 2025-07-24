'use client'

import { useState } from 'react'

export default function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const passcode = 'froggersMint2025' // ✅ Dein Zugangscode (änderbar!)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === passcode) {
      onUnlock()
    } else {
      setError('🐸 Falscher Glibbercode!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center p-6 border rounded bg-white text-glibberGray shadow-lg">
      <label className="text-lg font-semibold">🔒 Zugangscode</label>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border px-4 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-frogGreen"
        placeholder="Froggers-Code eingeben"
      />
      <button
        type="submit"
        className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110"
      >
        Freischalten
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
