import { useEffect } from 'react'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const AVATARS = ['🧑', '👱', '👩', '🧔', '👨', '👧', '🧒', '👴', '👵', '🙋']

function getAvatar(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATARS[Math.abs(hash) % AVATARS.length]
}

export default function SupportersModal({ signatures, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="font-black text-xl text-gray-900">Supporters</h2>
            <p className="text-xs text-gray-400">{signatures.length} people standing with Harry</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {signatures.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No signatures yet. Be the first!</p>
          )}
          {signatures.map((sig, i) => (
            <div
              key={sig.id}
              className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3"
            >
              <span className="text-xl select-none mt-0.5">{getAvatar(sig.name)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm truncate">{sig.name}</p>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(sig.signed_at)}</span>
                </div>
                {sig.reason && (
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">"{sig.reason}"</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">#FreeHarry — he deserves better</p>
        </div>
      </div>
    </div>
  )
}
