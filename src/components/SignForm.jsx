import { useState, useRef } from 'react'
import { postSignature } from '../lib/api'

function compressImage(file, maxDim = 300, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = url
  })
}

export default function SignForm({ onSigned, glass = false }) {
  const [type, setType] = useState('against') // 'against' | 'pro'
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [signed, setSigned] = useState(false)
  const [signerName, setSignerName] = useState('')
  const fileRef = useRef(null)

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setPhoto(await compressImage(file))
    } catch {
      // ignore
    }
    e.target.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await postSignature(name.trim(), reason.trim() || null, photo, type)
      setSignerName(name.trim())
      setSigned(true)
      onSigned?.()
      setTimeout(() => {
        setSigned(false)
        setName('')
        setReason('')
        setPhoto(null)
        setType('against')
      }, 2500)
    } catch (err) {
      console.error('Sign error:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = glass
    ? 'w-full px-4 py-3 rounded-xl border border-white/30 bg-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-base backdrop-blur-sm'
    : 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-base shadow-sm'

  if (signed) {
    return (
      <div className={`flex flex-col items-center gap-2 py-4 px-4 rounded-2xl border ${glass ? 'bg-white/15 border-white/30' : 'bg-green-50 border-green-200'}`}>
        <div className="text-3xl">{type === 'pro' ? '❤️' : '✅'}</div>
        <p className={`font-bold text-lg ${glass ? 'text-white' : 'text-green-800'}`}>Message sent!</p>
        <p className={`text-sm ${glass ? 'text-white/70' : 'text-green-600'}`}>Thanks for sharing, {signerName}.</p>
      </div>
    )
  }

  const isPro = type === 'pro'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      {/* Type toggle */}
      <div className={`flex rounded-xl overflow-hidden border ${glass ? 'border-white/20' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={() => setType('against')}
          className={`flex-1 py-2 text-xs font-bold transition-colors ${
            !isPro
              ? (glass ? 'bg-white/20 text-white' : 'bg-gray-800 text-white')
              : (glass ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600')
          }`}
        >
          ✂️ Break them up
        </button>
        <button
          type="button"
          onClick={() => setType('pro')}
          className={`flex-1 py-2 text-xs font-bold transition-colors ${
            isPro
              ? (glass ? 'bg-red-500/60 text-white' : 'bg-red-500 text-white')
              : (glass ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600')
          }`}
        >
          ❤️ I support them!
        </button>
      </div>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        maxLength={60}
        required
        className={inputClass}
      />
      <textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder={isPro ? "Why do you think they're great together? (optional)" : "Why do you think they're better apart? (optional)"}
        maxLength={280}
        rows={2}
        className={`${inputClass} resize-none`}
      />

      {/* Photo upload */}
      <div className="flex items-center gap-3">
        {photo && (
          <div className="relative shrink-0">
            <img src={photo} alt="preview" className="w-14 h-14 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center shadow"
            >×</button>
          </div>
        )}
        <label className={`cursor-pointer text-xs px-3 py-2 rounded-xl border transition-colors ${
          glass
            ? 'border-white/20 text-white/50 hover:text-white/80 hover:border-white/40'
            : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
        }`}>
          📷 {photo ? 'Change photo' : 'Add photo'}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className={`w-full py-3.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl shadow-lg transition-all duration-150 active:scale-95 ${
          isPro
            ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-red-900/30'
            : 'bg-gray-800 hover:bg-gray-900 active:bg-black shadow-black/30'
        }`}
      >
        {loading ? 'Sending…' : isPro ? '❤️ I support them!' : '✍️ Sign the Petition'}
      </button>
      {error && <p className={`text-sm text-center ${glass ? 'text-red-300' : 'text-red-500'}`}>{error}</p>}
    </form>
  )
}
