import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import HeroSection from './components/HeroSection'
import SignForm from './components/SignForm'
import SignatureLog from './components/SignatureLog'

export default function App() {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSignatures()

    const channel = supabase
      .channel('public:signatures')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'signatures' },
        payload => setSignatures(prev => [payload.new, ...prev])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchSignatures() {
    const { data } = await supabase
      .from('signatures')
      .select('*')
      .order('signed_at', { ascending: false })
    if (data) setSignatures(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto pb-16">
        <HeroSection count={loading ? '—' : signatures.length} />

        <div className="px-4 flex flex-col gap-8">
          <SignForm />
          {!loading && <SignatureLog signatures={signatures} />}
        </div>

        <footer className="mt-12 text-center text-xs text-gray-300 px-4">
          Made with love (and concern) by Harry's friends.
        </footer>
      </div>
    </div>
  )
}
