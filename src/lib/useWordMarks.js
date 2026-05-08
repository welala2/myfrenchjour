import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

export function useWordMarks() {
  const { user } = useAuth()
  const [marks, setMarks] = useState({}) // { wordKey: 'known' | 'review' }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setMarks({}); setLoading(false); return }
    supabase
      .from('word_marks')
      .select('word_key, status')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const m = {}
        data?.forEach(r => { m[r.word_key] = r.status })
        setMarks(m)
        setLoading(false)
      })
  }, [user])

  const setMark = useCallback(async (wordKey, status) => {
    if (!user) return
    setMarks(prev => ({ ...prev, [wordKey]: status }))
    if (status === 'none') {
      await supabase.from('word_marks').delete()
        .eq('user_id', user.id).eq('word_key', wordKey)
    } else {
      await supabase.from('word_marks').upsert({
        user_id: user.id, word_key: wordKey, status,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,word_key' })
    }
  }, [user])

  const getMark = useCallback((wordKey) => marks[wordKey] || 'none', [marks])

  return { marks, getMark, setMark, loading }
}
