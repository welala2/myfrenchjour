import { useState } from 'react'
import { useQuiz } from '../lib/useQuiz'
import styles from './Quiz.module.css'

const RATINGS = [
  { q: 1, label: 'Again', sub: 'Didn\'t know', color: '#c44' },
  { q: 3, label: 'Hard', sub: 'Got it, with effort', color: '#d4614a' },
  { q: 4, label: 'Good', sub: 'Got it', color: '#3a6b8a' },
  { q: 5, label: 'Easy', sub: 'Knew it instantly', color: '#4a7a4a' },
]

export default function Quiz() {
  const { quizCards, recordResult, loading, totalWords } = useQuiz()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)
  const [sessionResults, setSessionResults] = useState([]) // {word, quality}

  if (loading) return <div className={styles.center}><div className={styles.spinner} /></div>

  if (quizCards.length === 0 || done) {
    const correct = sessionResults.filter(r => r.quality >= 3).length
    return (
      <div className={styles.center}>
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>🎉</div>
          <h2 className={styles.doneTitle}>
            {quizCards.length === 0 ? 'All caught up!' : 'Session complete!'}
          </h2>
          <p className={styles.doneSub}>
            {quizCards.length === 0
              ? 'No words due for review right now. Come back tomorrow!'
              : `${correct} / ${sessionResults.length} correct · Great work`}
          </p>
          {sessionResults.length > 0 && (
            <div className={styles.doneStats}>
              <div className={styles.doneStat}>
                <span className={styles.doneN} style={{ color: '#4a7a4a' }}>{correct}</span>
                <span className={styles.doneL}>Correct</span>
              </div>
              <div className={styles.doneStat}>
                <span className={styles.doneN} style={{ color: '#d4614a' }}>{sessionResults.length - correct}</span>
                <span className={styles.doneL}>Missed</span>
              </div>
              <div className={styles.doneStat}>
                <span className={styles.doneN}>{totalWords}</span>
                <span className={styles.doneL}>Total words</span>
              </div>
            </div>
          )}
          <button className={styles.restartBtn} onClick={() => { setIndex(0); setRevealed(false); setDone(false); setSessionResults([]) }}>
            Study again
          </button>
        </div>
      </div>
    )
  }

  const word = quizCards[index]
  const progress = index / quizCards.length

  async function rate(quality) {
    await recordResult(word, quality)
    setSessionResults(prev => [...prev, { word, quality }])
    if (index + 1 >= quizCards.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setRevealed(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.topBar}>
        <span className={styles.counter}>{index + 1} / {quizCards.length}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>
        <button className={styles.endBtn} onClick={() => setDone(true)}>End session</button>
      </div>

      <div className={styles.card} onClick={!revealed ? () => setRevealed(true) : undefined}>
        <div className={styles.cardBadge}>{word.catLabel}</div>
        <p className={styles.cardFr}>{word.f}</p>

        {!revealed ? (
          <button className={styles.revealBtn} onClick={() => setRevealed(true)}>
            Tap to reveal
          </button>
        ) : (
          <div className={styles.revealed}>
            <p className={styles.cardEn}>{word.e}</p>
            <div className={styles.divider} />
            <p className={styles.cardEx}>{word.fr}</p>
            <p className={styles.cardExEn}>{word.en}</p>
          </div>
        )}
      </div>

      {revealed && (
        <div className={styles.ratings}>
          {RATINGS.map(r => (
            <button
              key={r.q}
              className={styles.ratingBtn}
              style={{ '--btn-color': r.color }}
              onClick={() => rate(r.q)}
            >
              <span className={styles.ratingLabel}>{r.label}</span>
              <span className={styles.ratingSub}>{r.sub}</span>
            </button>
          ))}
        </div>
      )}

      {!revealed && (
        <p className={styles.hint}>What does this mean in English?</p>
      )}
    </main>
  )
}
