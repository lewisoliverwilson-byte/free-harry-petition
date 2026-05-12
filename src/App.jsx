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
    <div className="h-dvh relative overflow-hidden w-full">

      {/* Full-screen background */}
      <img
        src="/harry.png"
        alt="Harry"
        className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
      />

      {/* Multi-stop gradient: transparent top → heavy dark bottom */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)' }}
      />

      {/* Content layer */}
      <div className="relative h-full flex flex-col justify-between px-5 pt-10 pb-7 max-w-lg mx-auto w-full">

        {/* Top badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            OFFICIAL PETITION
          </div>
        </div>

        {/* Centre headline */}
        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="text-6xl font-black text-white leading-none tracking-tight"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
            HARRY<br />&amp; CARA
          </h1>
          <p className="text-white/70 text-sm font-medium max-w-xs"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            We love them both — we just think they shine brighter apart ❤️
          </p>
          <button
            onClick={() => setModalOpen(true)}
            disabled={count === 0}
            className="flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 hover:bg-black/50 transition-colors disabled:pointer-events-none"
          >
            <span className="text-xl font-black text-white">{count.toLocaleString()}</span>
            <span className="text-white/70 text-sm">
              {count === 1 ? 'person agrees' : 'people agree'}
              {count > 0 && <span className="text-red-300 ml-1.5">see who →</span>}
            </span>
          </button>
        </div>

        {/* Bottom form card */}
        <div className="flex flex-col gap-3">
          <p className="text-white/60 text-xs text-center tracking-wide uppercase font-semibold">
            Add your name to show your support
          </p>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-2xl">
            <SignForm glass onSigned={fetchSignatures} />
          </div>
          {count > 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors text-center"
            >
              See all {count} supporters →
            </button>
          )}
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
