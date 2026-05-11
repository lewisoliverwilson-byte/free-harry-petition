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

export default function SignatureLog({ signatures }) {
  if (!signatures.length) return null

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 text-center">
        Recent Signers
      </h2>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
        {signatures.map(sig => (
          <div
            key={sig.id}
            className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
          >
            <span className="text-2xl select-none mt-0.5">{getAvatar(sig.name)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-900 truncate">{sig.name}</p>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(sig.signed_at)}</span>
              </div>
              {sig.reason && (
                <p className="text-sm text-gray-500 mt-1 leading-snug">"{sig.reason}"</p>
              )}
            </div>
            <span className="text-green-500 text-lg mt-0.5">✓</span>
          </div>
        ))}
      </div>
    </div>
  )
}
