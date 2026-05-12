export default function HeroSection({ count, onViewSupporters }) {
  return (
    <div className="relative w-full" style={{ height: '42vh' }}>
      {/* Full-bleed photo */}
      <img
        src="/harry.png"
        alt="Harry"
        className="w-full h-full object-cover object-top"
      />

      {/* Gradient fade to background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-gray-50" />

      {/* Text pinned to bottom of photo */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-3 px-4">
        <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          OFFICIAL PETITION
        </div>

        <h1 className="text-5xl font-black text-white drop-shadow-lg tracking-tight mb-1">
          #FREEHARRY
        </h1>

        <button
          onClick={onViewSupporters}
          disabled={count === 0}
          className="flex items-baseline gap-1.5 hover:opacity-70 transition-opacity disabled:pointer-events-none"
        >
          <span className="text-2xl font-black text-white drop-shadow">{count.toLocaleString()}</span>
          <span className="text-white/80 text-sm font-medium drop-shadow">
            {count === 1 ? 'person agrees' : 'people agree'}
            {count > 0 && <span className="text-red-300 ml-1">— see who →</span>}
          </span>
        </button>
      </div>
    </div>
  )
}
