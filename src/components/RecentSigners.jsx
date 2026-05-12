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

function score(sig) { return (sig.upvotes ?? 0) - (sig.downvotes ?? 0) }

export default function RecentSigners({ signatures, onSeeAll }) {
  const recent = signatures
    .filter(s => !s.parent_id)
    .sort((a, b) => score(b) - score(a) || new Date(b.signed_at) - new Date(a.signed_at))
    .slice(0, 5)

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col">
      <div className="px-5 pt-4 pb-3 border-b border-white/10">
        <p className="text-white font-black text-lg">Recent Messages</p>
      </div>

      <div className="flex flex-col divide-y divide-white/10 flex-1 overflow-hidden">
        {recent.length === 0 && (
          <p className="text-white/40 text-sm text-center py-6 px-5">
            Be the first to leave a message!
          </p>
        )}
        {recent.map(sig => {
          const isPro = sig.type === 'pro'
          return (
            <div key={sig.id} className="flex items-start gap-3 px-4 py-3">
              <span className="text-xl select-none mt-0.5">{getAvatar(sig.name)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-semibold text-sm truncate ${isPro ? 'text-red-400' : 'text-white'}`}>
                    {isPro && <span className="mr-1">❤️</span>}{sig.name}
                  </p>
                  <span className="text-white/40 text-xs shrink-0">{timeAgo(sig.signed_at)}</span>
                </div>
                {sig.reason && (
                  <p className={`text-xs mt-0.5 leading-snug line-clamp-2 ${isPro ? 'text-red-300/80' : 'text-white/60'}`}>
                    "{sig.reason}"
                  </p>
                )}
                {sig.photo && (
                  <img
                    src={sig.photo}
                    alt=""
                    className="mt-1.5 w-full max-h-28 object-cover rounded-lg"
                  />
                )}
                {((sig.upvotes ?? 0) > 0 || (sig.downvotes ?? 0) > 0) && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/40">👍 {sig.upvotes ?? 0}</span>
                    <span className="text-xs text-white/40">👎 {sig.downvotes ?? 0}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {signatures.length > 0 && (
        <button
          onClick={onSeeAll}
          className="w-full py-3 text-sm text-white/60 hover:text-white transition-colors border-t border-white/10 font-medium"
        >
          See all {signatures.length} messages →
        </button>
      )}
    </div>
  )
}
