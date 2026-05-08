import { useMemo, useState } from 'react'
import { data } from '../data/vocabulary'
import { useWordMarks } from '../lib/useWordMarks'
import { useAuth } from '../lib/AuthContext'
import { getAllWords } from '../lib/srs'
import styles from './Vocabulary.module.css'

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'nouns', label: 'Nouns' },
  { key: 'essentials', label: 'Essentials' },
  { key: 'verbs', label: 'Verbs' },
  { key: 'adjectives', label: 'Adjectives' },
  { key: 'adverbs', label: 'Adverbs' },
  { key: 'time', label: 'Time & Place' },
  { key: 'people', label: 'People & Body' },
  { key: 'home', label: 'Home & City' },
  { key: 'food', label: 'Food & Nature' },
  { key: 'emotions', label: 'Emotions' },
  { key: 'numbers', label: 'Numbers' },
  { key: 'travel', label: 'Travel' },
  { key: 'phrases', label: 'Phrases' },
  { key: 'work', label: 'Work & Study' },
  { key: 'health', label: 'Health & Sport' },
  { key: 'arts', label: 'Arts & Culture' },
  { key: 'environment', label: 'World' },
  { key: 'clothes', label: 'Clothes' },
  { key: 'cooking', label: 'Cooking' },
  { key: 'social', label: 'Social Life' },
  { key: 'misc', label: 'Extras' },
  { key: 'extra2', label: 'More Essentials' },
  { key: 'yours', label: '⭐ Your Words' },
]

export default function Vocabulary() {
  const { user } = useAuth()
  const { getMark, setMark, marks } = useWordMarks()
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [hideKnown, setHideKnown] = useState(false)
  const [expandedKey, setExpandedKey] = useState(null)

  const allWords = useMemo(() => getAllWords(data), [])

  const filtered = useMemo(() => {
    const seen = new Set()
    let words = []

    if (cat === 'all') {
      words = allWords
    } else if (cat === 'yours') {
      words = allWords.filter(w => w.y)
    } else {
      const catData = data[cat]
      if (catData) {
        catData.sub.forEach(sub => sub.words.forEach(w => {
          if (!seen.has(w.f)) { seen.add(w.f); words.push({ ...w, subLabel: sub.label }) }
        }))
      }
    }

    if (search) {
      const q = search.toLowerCase()
      words = words.filter(w =>
        w.f.toLowerCase().includes(q) ||
        w.e.toLowerCase().includes(q) ||
        (w.fr && w.fr.toLowerCase().includes(q)) ||
        (w.en && w.en.toLowerCase().includes(q))
      )
    }

    if (hideKnown) {
      words = words.filter(w => getMark(w.f) !== 'known')
    }

    return words
  }, [cat, search, hideKnown, marks, allWords])

  // Group by subLabel for display
  const grouped = useMemo(() => {
    if (search || cat === 'yours') return [{ label: null, words: filtered }]
    const groups = {}
    const order = []
    filtered.forEach(w => {
      const key = w.subLabel || w.catLabel || 'Other'
      if (!groups[key]) { groups[key] = []; order.push(key) }
      groups[key].push(w)
    })
    return order.map(k => ({ label: k, words: groups[k] }))
  }, [filtered, search, cat])

  const knownCount = allWords.filter(w => getMark(w.f) === 'known').length
  const reviewCount = allWords.filter(w => getMark(w.f) === 'review').length
  const pct = Math.round(knownCount / allWords.length * 100)

  function cycleMark(wordKey, e) {
    e.stopPropagation()
    if (!user) return
    const current = getMark(wordKey)
    const next = current === 'none' ? 'known' : current === 'known' ? 'review' : 'none'
    setMark(wordKey, next)
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vocabulaire</h1>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.progressLabel}>
            {user
              ? `${knownCount} known · ${reviewCount} to review · ${pct}%`
              : `${allWords.length} words · sign in to track progress`}
          </span>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search French or English..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.filterBtns}>
          {user && (
            <button
              className={`${styles.filterBtn} ${hideKnown ? styles.active : ''}`}
              onClick={() => setHideKnown(h => !h)}
            >
              {hideKnown ? '👁 Showing unknown' : '👁 Hide known'}
            </button>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {CATS.map(c => (
          <button
            key={c.key}
            className={`${styles.tab} ${cat === c.key ? styles.activeTab : ''}`}
            onClick={() => { setCat(c.key); setSearch('') }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.notebook}>
        <div className={styles.notebookHeader}>
          <span className={styles.sectionTitle}>
            {cat === 'all' ? 'All Words' : cat === 'yours' ? 'Your Words' : data[cat]?.label || cat}
          </span>
          <span className={styles.wordCount}>{filtered.length} words</span>
        </div>

        <div className={styles.notebookBody}>
          <div className={styles.marginStrip} />
          <div className={styles.lines}>
            {grouped.map(group => (
              <div key={group.label || 'main'}>
                {group.label && <div className={styles.subHeader}>{group.label}</div>}
                {group.words.map(w => {
                  const mark = getMark(w.f)
                  const isExpanded = expandedKey === w.f
                  return (
                    <div
                      key={w.f}
                      className={`${styles.row} ${w.y ? styles.yours : ''} ${mark === 'known' ? styles.known : mark === 'review' ? styles.review : ''}`}
                      onClick={() => setExpandedKey(isExpanded ? null : w.f)}
                    >
                      <div className={styles.rowTop}>
                        <span className={styles.french}>{w.f}</span>
                        <span className={styles.dash}>—</span>
                        <span className={styles.english}>{w.e}</span>
                        {w.y && <span className={styles.yourBadge}>your word</span>}
                        {user && (
                          <button
                            className={`${styles.markBtn} ${mark === 'known' ? styles.markKnown : mark === 'review' ? styles.markReview : ''}`}
                            onClick={(e) => cycleMark(w.f, e)}
                            title="Mark as Known → Review → Unmark"
                          >
                            {mark === 'known' ? '✓ Known' : mark === 'review' ? '★ Review' : 'Mark'}
                          </button>
                        )}
                        <span className={styles.expandHint}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                      {isExpanded && (
                        <div className={styles.example}>
                          <p className={styles.exFr}>{w.fr}</p>
                          <p className={styles.exEn}>{w.en}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={styles.empty}>No words found.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
