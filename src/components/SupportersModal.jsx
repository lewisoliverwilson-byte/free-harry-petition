import { useEffect, useState, useMemo } from 'react'
import { postVote, postSignature } from '../lib/api'

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

function getMyVotes() {
  try { return JSON.parse(localStorage.getItem('petition_my_votes') ?? '{}') } catch { return {} }
}

function score(sig) { return (sig.upvotes ?? 0) - (sig.downvotes ?? 0) }

function ReplyForm({ parentId, onReplied, onCancel }) {
  const [name, setName]   = useState('')
  const [text, setText]   = useState('')
  const [busy, setBusy]   = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      await postSignature(name.trim(), text.trim() || null, null, 'against', parentId)
      onReplied()
    } catch {}
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="mt-2 ml-8 flex flex-col gap-1.5">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        maxLength={60}
        required
        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a reply…"
        maxLength={280}
        rows={2}
        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="px-4 py-1.5 text-xs font-bold bg-gray-800 hover:bg-gray-900 disabled:opacity-40 text-white rounded-lg"
        >
          {busy ? 'Posting…' : 'Post reply'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 text-xs text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function MessageCard({ sig, replies, myVotes, onVote, onReply, depth = 0 }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const isPro  = sig.type === 'pro'
  const myVote = myVotes[sig.id]

  function handleVote(dir) {
    if (myVote) return
    onVote(sig.id, dir)
  }

  return (
    <div className={depth > 0 ? 'ml-6 mt-2 border-l-2 border-gray-100 pl-3' : ''}>
      <div className={`flex items-start gap-3 rounded-2xl px-4 py-3 ${isPro ? 'bg-red-50' : 'bg-gray-50'}`}>
        <span className="text-xl select-none mt-0.5">{getAvatar(sig.name)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-semibold text-sm truncate ${isPro ? 'text-red-600' : 'text-gray-900'}`}>
              {isPro && '❤️ '}{sig.name}
            </p>
            <span className="text-xs text-gray-400 shrink-0">{timeAgo(sig.signed_at)}</span>
          </div>
          {sig.reason && (
            <p className={`text-sm mt-0.5 leading-snug ${isPro ? 'text-red-500' : 'text-gray-500'}`}>
              "{sig.reason}"
            </p>
          )}
          {sig.photo && (
            <img src={sig.photo} alt="" className="mt-2 w-full max-h-48 object-cover rounded-xl" />
          )}

          {/* Vote + reply row */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => handleVote('up')}
              title={myVote ? 'Already voted' : 'Thumbs up'}
              className={`flex items-center gap-1 text-xs font-semibold rounded-lg px-2 py-1 transition-colors ${
                myVote === 'up'
                  ? 'bg-green-100 text-green-700'
                  : myVote
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              👍 {sig.upvotes ?? 0}
            </button>
            <button
              onClick={() => handleVote('down')}
              title={myVote ? 'Already voted' : 'Thumbs down'}
              className={`flex items-center gap-1 text-xs font-semibold rounded-lg px-2 py-1 transition-colors ${
                myVote === 'down'
                  ? 'bg-red-100 text-red-600'
                  : myVote
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              👎 {sig.downvotes ?? 0}
            </button>
            {depth === 0 && (
              <button
                onClick={() => setReplyOpen(v => !v)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                💬 Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {replyOpen && (
        <ReplyForm
          parentId={sig.id}
          onReplied={() => { setReplyOpen(false); onReply() }}
          onCancel={() => setReplyOpen(false)}
        />
      )}

      {replies.map(reply => (
        <MessageCard
          key={reply.id}
          sig={reply}
          replies={[]}
          myVotes={myVotes}
          onVote={onVote}
          onReply={onReply}
          depth={1}
        />
      ))}
    </div>
  )
}

export default function SupportersModal({ signatures, onClose, onRefresh }) {
  const [localSigs, setLocalSigs] = useState(signatures)
  const [myVotes, setMyVotes]     = useState(() => getMyVotes())

  // Stay in sync with parent polls
  useEffect(() => setLocalSigs(signatures), [signatures])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleVote(id, dir) {
    if (myVotes[id]) return
    const next = { ...myVotes, [id]: dir }
    setMyVotes(next)
    localStorage.setItem('petition_my_votes', JSON.stringify(next))
    // Optimistic update
    setLocalSigs(sigs => sigs.map(s => s.id !== id ? s : {
      ...s,
      upvotes:   (s.upvotes   ?? 0) + (dir === 'up'   ? 1 : 0),
      downvotes: (s.downvotes ?? 0) + (dir === 'down' ? 1 : 0),
    }))
    postVote(id, dir).catch(() => {})
  }

  // Build sorted tree
  const { topLevel, repliesMap } = useMemo(() => {
    const top = localSigs
      .filter(s => !s.parent_id)
      .sort((a, b) => score(b) - score(a) || new Date(b.signed_at) - new Date(a.signed_at))
    const map = {}
    localSigs
      .filter(s => s.parent_id)
      .forEach(s => {
        if (!map[s.parent_id]) map[s.parent_id] = []
        map[s.parent_id].push(s)
      })
    Object.values(map).forEach(arr =>
      arr.sort((a, b) => score(b) - score(a) || new Date(a.signed_at) - new Date(b.signed_at))
    )
    return { topLevel: top, repliesMap: map }
  }, [localSigs])

  const totalReplies = localSigs.filter(s => s.parent_id).length

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="font-black text-xl text-gray-900">Messages of Support</h2>
            <p className="text-xs text-gray-400">
              {topLevel.length} messages · {totalReplies} replies · sorted by votes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg transition-colors"
          >×</button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {topLevel.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No messages yet. Be the first!</p>
          )}
          {topLevel.map(sig => (
            <MessageCard
              key={sig.id}
              sig={sig}
              replies={repliesMap[sig.id] ?? []}
              myVotes={myVotes}
              onVote={handleVote}
              onReply={onRefresh}
            />
          ))}
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">We love you both ❤️</p>
        </div>
      </div>
    </div>
  )
}
