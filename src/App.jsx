import { useState, useEffect, useCallback } from 'react'
import { getSignatures } from './lib/api'
import SignForm from './components/SignForm'
import SupportersModal from './components/SupportersModal'

export default function App() {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchSignatures = useCallback(async () => {
    try {
      const data = await getSignatures()
      setSignatures(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSignatures()
    const interval = setInterval(fetchSignatures, 10000)
    return () => clearInterval(interval)
  }, [fetchSignatures])

  const count = loading ? 0 : signatures.length

  return (
    <div className="h-dvh relative overflow-hidden max-w-sm mx-auto w-full">

      {/* Full-screen background photo */}
      <img
        src="/harry.png"
        alt="Harry"
        className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
      />

      {/* Gradient overlay — light at top, dark at bottom for form readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between px-5 py-8">

        {/* Top — headline */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            OFFICIAL PETITION
          </div>
          <h1 className="text-6xl font-black text-white drop-shadow-xl tracking-tight leading-none mb-3">
            #FREEHARRY
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            disabled={count === 0}
            className="flex items-baseline gap-2 hover:opacity-70 transition-opacity disabled:pointer-events-none"
          >
            <span className="text-3xl font-black text-white drop-shadow-lg">{count.toLocaleString()}</span>
            <span className="text-white/70 text-sm font-medium">
              {count === 1 ? 'person agrees' : 'people agree'}
              {count > 0 && <span className="text-red-300 ml-1">— see who →</span>}
            </span>
          </button>
        </div>

        {/* Bottom — frosted glass form card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-2xl flex flex-col gap-3">
          <p className="text-white/80 text-sm text-center font-medium">
            Harry deserves better. Add your voice.
          </p>
          <SignForm glass onSigned={fetchSignatures} />
          <button
            onClick={() => setModalOpen(true)}
            disabled={count === 0}
            className="text-sm text-white/50 hover:text-white/80 transition-colors disabled:opacity-0 text-center"
          >
            See all {count} supporters →
          </button>
        </div>
      </div>

      {modalOpen && (
        <SupportersModal
          signatures={signatures}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
