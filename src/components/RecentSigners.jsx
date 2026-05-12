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

export default function RecentSigners({ signatures, onSeeAll }) {
  const recent = signatures.slice(0, 5)

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col">
      <div className="px-5 pt-4 pb-3 border-b border-white/10">
        <p className="text-white font-black text-lg">Recent Supporters</p>
        <p className="text-white/50 text-xs">{signatures.length} people showing their support</p>
      </div>

      <div className="flex flex-col divide-y divide-white/10 flex-1 overflow-hidden">
        {recent.length === 0 && (
          <p className="text-white/40 text-sm text-center py-6 px-5">
            Be the first to sign!
          </p>
        )}
        {recent.map(sig => (
          <div key={sig.id} className="flex items-start gap-3 px-4 py-3">
            <span className="text-xl select-none mt-0.5">{getAvatar(sig.name)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white text-sm truncate">{sig.name}</p>
                <span className="text-white/40 text-xs shrink-0">{timeAgo(sig.signed_at)}</span>
              </div>
              {sig.reason && (
                <p className="text-white/60 text-xs mt-0.5 leading-snug line-clamp-2">"{sig.reason}"</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {signatures.length > 0 && (
        <button
          onClick={onSeeAll}
          className="w-full py-3 text-sm text-white/60 hover:text-white transition-colors border-t border-white/10 font-medium"
        >
          See all {signatures.length} supporters →
        </button>
      )}
    </div>
  )
}
