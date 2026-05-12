import { useState, useEffect } from 'react'
import { getClickCount, postClick } from '../lib/api'

export default function ClickCounter({ glass = false }) {
  const [count, setCount]       = useState(null)
  const [bump, setBump]         = useState(false)

  useEffect(() => {
    getClickCount().then(d => setCount(d.count)).catch(() => {})
    const t = setInterval(
      () => getClickCount().then(d => setCount(d.count)).catch(() => {}),
      5000
    )
    return () => clearInterval(t)
  }, [])

  async function handleClick() {
    // Optimistic update
    setCount(c => (c ?? 0) + 1)
    setBump(true)
    setTimeout(() => setBump(false), 150)
    try {
      const { count: confirmed } = await postClick()
      setCount(confirmed)
    } catch {}
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className={`
          w-full py-4 px-5 rounded-2xl font-black text-base tracking-wide
          transition-all duration-100 select-none
          ${bump ? 'scale-95' : 'scale-100'}
          ${glass
            ? 'bg-red-600/80 hover:bg-red-600 active:bg-red-700 text-white border border-red-400/30 shadow-lg shadow-red-900/40'
            : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-900/30'
          }
        `}
      >
        💔 Click if they should break up
      </button>
      {count !== null && (
        <p className={`text-sm font-semibold tabular-nums ${glass ? 'text-white/50' : 'text-gray-500'}`}>
          {count.toLocaleString()} {count === 1 ? 'click' : 'clicks'}
        </p>
      )}
    </div>
  )
}
