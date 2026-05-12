import { useState } from 'react'

const PASSWORDS = ['MONTY']
const STORAGE_KEY = 'petition_unlocked'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === '1'
  )
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (PASSWORDS.includes(input)) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setUnlocked(true)
    } else {
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  if (unlocked) return children

  return (
    <div className="h-dvh bg-black flex flex-col items-center justify-center px-8">
      <h1 className="text-white text-5xl font-black tracking-widest mb-12 select-none">
        SECRET
      </h1>
      <form onSubmit={handleSubmit} className={`w-full max-w-xs flex flex-col gap-3 ${shake ? 'animate-shake' : ''}`}>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-center text-lg tracking-widest"
        />
        <button
          type="submit"
          className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  )
}
