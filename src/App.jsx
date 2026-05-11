import { useState, useEffect, useCallback } from 'react'
import { getSignatures } from './lib/api'
import HeroSection from './components/HeroSection'
import SignForm from './components/SignForm'
import SupportersModal from './components/SupportersModal'

export default function App() {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchSignatures = useCallback(async () => {
    try {
      const data = await getSignatures()
      setSignatures(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSignatures()
    const interval = setInterval(fetchSignatures, 10000)
    return () => clearInterval(interval)
  }, [fetchSignatures])

  const count = loading ? 0 : signatures.length

  return (
    <div className="h-dvh bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <HeroSection
          count={count}
          onViewSupporters={() => setModalOpen(true)}
        />
        <SignForm onSigned={fetchSignatures} />
        <button
          onClick={() => setModalOpen(true)}
          disabled={count === 0}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-0 text-center"
        >
          See all {count} supporters →
        </button>
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
