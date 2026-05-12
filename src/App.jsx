import { useState, useEffect, useCallback, useMemo } from 'react'
import { getSignatures } from './lib/api'
import SignForm from './components/SignForm'
import SupportersModal from './components/SupportersModal'
import RecentSigners from './components/RecentSigners'
import ClickCounter from './components/ClickCounter'

const SLIDES = [
  { src: '/harry.png',     pos: 'center 15%' },
  { src: '/IMG_2965.png',  pos: 'center 20%' },
  { src: '/IMG_2966.png',  pos: 'center 40%' },
  { src: '/IMG_2967.png',  pos: 'center 25%' },
  { src: '/IMG_2968.png',  pos: 'center 18%' },
  { src: '/IMG_2969.png',  pos: 'center 44%' },
  { src: '/IMG_2970.png',  pos: 'center 48%' },
]

function BackgroundSlideshow({ userSlides = [] }) {
  const allSlides = useMemo(() => [...SLIDES, ...userSlides], [userSlides])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % allSlides.length), 5000)
    return () => clearInterval(t)
  }, [allSlides.length])

  return (
    <>
      {allSlides.map(({ src, pos, key }, i) => (
        <img
          key={key ?? src}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: pos }}
        />
      ))}
    </>
  )
}

export default function App() {
  const [signatures, setSignatures] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const fetchSignatures = useCallback(async () => {
    try {
      const data = await getSignatures()
      setSignatures(data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    fetchSignatures()
    const interval = setInterval(fetchSignatures, 10000)
    return () => clearInterval(interval)
  }, [fetchSignatures])

  const userSlides = useMemo(() =>
    signatures
      .filter(s => s.photo)
      .slice(0, 12)
      .map(s => ({ src: s.photo, pos: s.photo_position ?? 'center 35%', key: s.id })),
    [signatures]
  )

  return (
    <div className="h-dvh relative overflow-hidden w-full">

      <BackgroundSlideshow userSlides={userSlides} />

      {/* Overlay: dark on sides, lighter in centre so Harry's face shows through */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.82) 100%)' }}
      />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* ── DESKTOP layout (md+): left panel | centre gap | right panel ── */}
      <div className="relative h-full hidden md:flex items-center px-10 lg:px-16 gap-8">

        {/* Left — badge, headline, counter, form */}
        <div className="flex flex-col gap-5 w-72 lg:w-80 shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-wide self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            OFFICIAL PETITION
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-6xl font-black text-white leading-none tracking-tight"
              style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
              HARRY<br />&amp; CARA
            </h1>
            <p className="text-white/70 text-sm font-medium"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              We love them both — we just think they shine brighter apart ❤️
            </p>
          </div>

          <ClickCounter glass />

          <div className="flex flex-col gap-2">
            <p className="text-white/50 text-xs tracking-wide uppercase font-semibold">
              Add your message
            </p>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-2xl">
              <SignForm glass onSigned={fetchSignatures} />
            </div>
          </div>
        </div>

        {/* Centre gap — lets Harry's face show through */}
        <div className="flex-1" />

        {/* Right — recent messages */}
        <div className="w-72 lg:w-80 shrink-0">
          <RecentSigners signatures={signatures} onSeeAll={() => setModalOpen(true)} />
        </div>
      </div>

      {/* ── MOBILE layout: stacked ── */}
      <div className="relative h-full flex flex-col justify-between px-5 pt-10 pb-7 md:hidden">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            OFFICIAL PETITION
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="text-6xl font-black text-white leading-none tracking-tight"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
            HARRY<br />&amp; CARA
          </h1>
          <p className="text-white/70 text-sm font-medium"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            We love them both — we just think they shine brighter apart ❤️
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <ClickCounter glass />

          <p className="text-white/60 text-xs text-center tracking-wide uppercase font-semibold">
            Add your message
          </p>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-2xl">
            <SignForm glass onSigned={fetchSignatures} />
          </div>
          {signatures.length > 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors text-center"
            >
              See all messages →
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
