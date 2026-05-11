import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SignForm({ onSigned }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [signed, setSigned] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)

    const { error: err } = await supabase
      .from('signatures')
      .insert({ name: name.trim() })

    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSigned(true)
      onSigned?.()
    }
    setLoading(false)
  }

  if (signed) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 px-6 bg-green-50 rounded-2xl border border-green-200">
        <div className="text-4xl">✅</div>
        <p className="text-green-800 font-bold text-xl">You're on the list!</p>
        <p className="text-green-600 text-sm">Thanks for standing with Harry, {name}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        maxLength={60}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-base shadow-sm"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl shadow-lg shadow-red-200 transition-all duration-150 active:scale-95"
      >
        {loading ? 'Signing…' : '✍️ Sign the Petition'}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  )
}
