export default function HeroSection({ count, onViewSupporters }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2">
        <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-25 scale-125" />
        <img
          src="/harry.png"
          alt="Harry"
          className="relative w-36 h-36 rounded-full object-cover object-top border-4 border-white shadow-xl"
        />
      </div>

      <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        OFFICIAL PETITION
      </div>

      <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-1">
        #FREEHARRY
      </h1>

      <p className="text-gray-400 text-sm mb-3">
        Harry deserves better. Add your voice.
      </p>

      <button
        onClick={onViewSupporters}
        disabled={count === 0}
        className="flex items-baseline gap-2 hover:opacity-70 transition-opacity disabled:pointer-events-none"
      >
        <span className="text-4xl font-black text-gray-900">{count.toLocaleString()}</span>
        <span className="text-gray-400 text-sm font-medium">
          {count === 1 ? 'person agrees' : 'people agree'}
          {count > 0 && <span className="text-red-400 ml-1">— see who →</span>}
        </span>
      </button>
    </div>
  )
}
