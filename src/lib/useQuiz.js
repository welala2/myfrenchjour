import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'
import { sm2, isDue, getAllWords } from './srs'
import { data } from '../data/vocabulary'

export function useQuiz() {
  const { user } = useAuth()
  const [quizCards, setQuizCards] = useState([]) // words due today
  const [cardData, setCardData] = useState({})   // SRS data per word
  const [loading, setLoading] = useState(true)

  const allWords = getAllWords(data)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from('quiz_cards')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data: rows }) => {
        const cd = {}
        rows?.forEach(r => { cd[r.word_key] = r })
        setCardData(cd)

        // Words due = any that are due, plus new words (never seen, limit 20 new/day)
        const due = allWords.filter(w => {
          const card = cd[w.f]
          if (!card) return false
          return isDue(card)
        })
        const newWords = allWords
          .filter(w => !cd[w.f])
          .slice(0, Math.max(0, 20 - due.length))

        setQuizCards(shuffle([...due, ...newWords]))
        setLoading(false)
      })
  }, [user])

  const recordResult = useCallback(async (word, quality) => {
    if (!user) return
    const existing = cardData[word.f] || {}
    const updated = sm2(existing, quality)
    const row = {
      user_id: user.id,
      word_key: word.f,
      ease_factor: updated.easeFactor,
      interval: updated.interval,
      repetitions: updated.repetitions,
      next_review: updated.nextReview,
      last_quality: quality,
      updated_at: new Date().toISOString()
    }
    setCardData(prev => ({ ...prev, [word.f]: row }))
    await supabase.from('quiz_cards').upsert(row, { onConflict: 'user_id,word_key' })
  }, [user, cardData])

  return { quizCards, cardData, recordResult, loading, totalWords: allWords.length }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
