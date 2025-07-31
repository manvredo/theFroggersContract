'use client'

import { useState, useRef, useEffect } from 'react'

export default function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  // const [attempts, setAttempts] = useState(0) // Optional Rate-Limiter

  const passcode = process.env.NEXT_PUBLIC_ACCESS_CODE || 'froggersMint2025'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Optional Rate-Limiting:
    // if (attempts >= 3) {
    //   setError('⛔ Zu viele Versuche – chill mal kurz, Bro!')
    //   return
    // }

    if (input === passcode) {
      setError('')
      setInput('')
      onUnlock()
    } else {
      setError('🐸 Falscher Glibbercode!')
      // setAttempts((prev) => prev + 1)
      setInput('')
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center p-6 border rounded bg-white text-glibberGray shadow-lg"
    >
      <label className="text-lg font-semibold">🔒 Zugangscode</label>
      <input
        type="password"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`border px-4 py-2 rounded w-64 focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 ring-red-300' : 'focus:ring-frogGreen'
        }`}
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
