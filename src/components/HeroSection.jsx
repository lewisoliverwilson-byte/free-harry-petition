export default function HeroSection({ count }) {
  return (
    <div className="flex flex-col items-center text-center px-4 pt-12 pb-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-red-500 blur-2xl opacity-20 scale-110" />
        <img
          src="/harry.png"
          alt="Harry"
          className="relative w-48 h-48 rounded-full object-cover object-top border-4 border-white shadow-2xl"
        />
      </div>

      <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        OFFICIAL PETITION
      </div>

      <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-4">
        #FREEHARRY
      </h1>

      <p className="text-gray-500 text-lg max-w-md mb-6">
        We, the people who love Harry, believe he deserves better.
        Add your name to the growing list of concerned citizens.
      </p>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-gray-900">{count.toLocaleString()}</span>
        <span className="text-gray-500 font-medium">
          {count === 1 ? 'person agrees' : 'people agree'}
        </span>
      </div>
    </div>
  )
}
