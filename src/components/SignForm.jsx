import { useState } from 'react'
import { postSignature } from '../lib/api'

export default function SignForm({ onSigned }) {
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [signed, setSigned] = useState(false)
  const [signerName, setSignerName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await postSignature(name.trim(), reason.trim() || null)
      setSignerName(name.trim())
      setSigned(true)
      onSigned?.()
      setTimeout(() => {
        setSigned(false)
        setName('')
        setReason('')
      }, 2500)
    } catch (err) {
      console.error('Sign error:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (signed) {
    return (
      <div className="flex flex-col items-center gap-2 py-5 px-4 bg-green-50 rounded-2xl border border-green-200">
        <div className="text-3xl">✅</div>
        <p className="text-green-800 font-bold text-lg">You're on the list!</p>
        <p className="text-green-600 text-sm">Thanks for standing with Harry, {signerName}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        maxLength={60}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-base shadow-sm"
      />
      <textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Why should Harry be free? (optional)"
        maxLength={280}
        rows={2}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-base shadow-sm resize-none"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl shadow-lg shadow-red-200 transition-all duration-150 active:scale-95"
      >
        {loading ? 'Signing…' : '✍️ Sign the Petition'}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  )
}
