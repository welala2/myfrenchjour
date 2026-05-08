import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useWordMarks } from '../lib/useWordMarks'
import { useQuiz } from '../lib/useQuiz'
import { getAllWords } from '../lib/srs'
import { data } from '../data/vocabulary'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const { marks, loading: marksLoading } = useWordMarks()
  const { quizCards, loading: quizLoading } = useQuiz()

  const allWords = getAllWords(data)
  const knownCount = allWords.filter(w => marks[w.f] === 'known').length
  const reviewCount = allWords.filter(w => marks[w.f] === 'review').length
  const unseenCount = allWords.length - knownCount - reviewCount
  const pct = Math.round(knownCount / allWords.length * 100)

  const dueCount = quizCards.length

  const email = user?.email || ''
  const name = email.split('@')[0]

  return (
    <main className={styles.main}>
      <div className={styles.greeting}>
        <p className={styles.greetingLabel}>Bonjour,</p>
        <h1 className={styles.greetingName}>{name}</h1>
      </div>

      {/* Today's session */}
      <div className={styles.todayCard}>
        <div className={styles.todayLeft}>
          <p className={styles.todayLabel}>Due for review today</p>
          <p className={styles.todayN}>{quizLoading ? '—' : dueCount}</p>
          <p className={styles.todaySub}>words</p>
        </div>
        <div className={styles.todayRight}>
          <Link to="/quiz" className={styles.startBtn}>
            {dueCount === 0 ? '✓ All caught up' : `Start session →`}
          </Link>
          <p className={styles.todayNote}>
            {dueCount === 0
              ? 'Come back tomorrow for more'
              : 'Takes about ' + Math.ceil(dueCount * 0.5) + ' minutes'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your progress</h2>
        <div className={styles.statsGrid}>
          <StatCard n={allWords.length} label="Total words" color="var(--ink)" />
          <StatCard n={knownCount} label="Known" color="var(--known)" />
          <StatCard n={reviewCount} label="To review" color="var(--review)" />
          <StatCard n={unseenCount} label="Not yet seen" color="var(--rule)" />
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            <div
              className={styles.progressReview}
              style={{ width: `${Math.round(reviewCount / allWords.length * 100)}%`, left: `${pct}%` }}
            />
          </div>
          <p className={styles.progressLabel}>{pct}% known — {100 - pct}% to go</p>
        </div>
      </div>

      {/* Quick links */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Study</h2>
        <div className={styles.links}>
          <QuickLink to="/vocabulary" icon="📖" title="Browse vocabulary" sub="All 1,860 words, searchable and filterable" />
          <QuickLink to="/tenses" icon="⏱" title="Verb tenses" sub="9 tenses with conjugation tables and examples" />
          <QuickLink to="/quiz" icon="🃏" title="Quiz mode" sub="Flashcards with spaced repetition" />
        </div>
      </div>
    </main>
  )
}

function StatCard({ n, label, color }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statN} style={{ color }}>{n}</span>
      <span className={styles.statL}>{label}</span>
    </div>
  )
}

function QuickLink({ to, icon, title, sub }) {
  return (
    <Link to={to} className={styles.quickLink}>
      <span className={styles.qlIcon}>{icon}</span>
      <div>
        <p className={styles.qlTitle}>{title}</p>
        <p className={styles.qlSub}>{sub}</p>
      </div>
      <span className={styles.qlArrow}>→</span>
    </Link>
  )
}
