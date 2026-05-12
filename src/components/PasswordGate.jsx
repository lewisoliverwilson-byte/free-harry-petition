import { useState } from 'react'

const PASSWORDS    = ['MONTY']
const KEY_UNLOCKED = 'petition_unlocked'
const KEY_AGREED   = 'petition_agreed'

export default function PasswordGate({ children }) {
  const [step, setStep] = useState(() => {
    if (sessionStorage.getItem(KEY_AGREED) === '1') return 'done'
    if (sessionStorage.getItem(KEY_UNLOCKED) === '1') return 'disclaimer'
    return 'password'
  })
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (PASSWORDS.includes(input.toUpperCase())) {
      sessionStorage.setItem(KEY_UNLOCKED, '1')
      setStep('disclaimer')
    } else {
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  function handleAgree() {
    sessionStorage.setItem(KEY_AGREED, '1')
    setStep('done')
  }

  if (step === 'done') return children

  if (step === 'disclaimer') {
    return (
      <div className="h-dvh bg-black flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h1 className="text-white text-3xl font-black tracking-widest text-center select-none">
            BEFORE YOU CONTINUE
          </h1>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <p className="text-white/80 text-sm leading-relaxed text-center">
              THE MAKER OF THIS WEBSITE TAKES NO RESPONSIBILITY FOR ANY MESSAGES,
              THEMES, OR IMAGES ON THIS SITE AND CANNOT BE TAKEN ACCOUNTABLE.
              BY CONTINUING YOU AGREE.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAgree}
              className="w-full py-3.5 bg-white text-black font-black rounded-xl hover:bg-white/90 transition-colors text-sm tracking-wide"
            >
              I AGREE — CONTINUE
            </button>
            <button
              onClick={() => { sessionStorage.removeItem(KEY_UNLOCKED); setStep('password') }}
              className="w-full py-2.5 text-white/30 hover:text-white/60 font-medium rounded-xl transition-colors text-xs"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

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
