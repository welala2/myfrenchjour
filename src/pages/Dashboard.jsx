import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useWordMarks } from '../lib/useWordMarks'
import { useQuiz } from '../lib/useQuiz'
import { getAllWords } from '../lib/srs'
import { data } from '../data/vocabulary'
import { LEVELS, passport } from '../lib/levels'
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

  // Passport: stamps unlock as known-word count crosses thresholds
  const pp = passport(knownCount)

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

      {/* French passport */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your French passport</h2>
        <div className={styles.passportCard}>
          <div className={styles.passportHeader}>
            <div>
              <p className={styles.passportEyebrow}>
                {pp.currentLevel
                  ? <>You've reached <strong>{pp.currentLevel.icon} {pp.currentLevel.name}</strong></>
                  : <>Start your French journey</>}
              </p>
              <p className={styles.passportSub}>
                {pp.next
                  ? <>Next stamp: <strong>{pp.next.icon} {pp.next.name}</strong> at {pp.next.threshold} words</>
                  : <>You've collected every stamp — c'est magnifique!</>}
              </p>
            </div>
            {pp.next && (
              <div className={styles.passportProgress}>
                <span className={styles.passportPct}>{pp.progressToNext}%</span>
                <span className={styles.passportPctLabel}>to next</span>
              </div>
            )}
          </div>
          <div className={styles.stampsRow}>
            {LEVELS.map(lv => {
              const reached = knownCount >= lv.threshold
              const passed = reached
              return (
                <div
                  key={lv.n}
                  className={`${styles.passportStamp} ${passed ? styles.passportStampReached : ''}`}
                  style={{ '--stamp-color': lv.color, '--stamp-bg': lv.bgColor }}
                >
                  <span className={styles.passportIcon}>{lv.icon}</span>
                  <span className={styles.passportName}>{lv.name}</span>
                  <span className={styles.passportThresh}>{lv.threshold}</span>
                  <span className={styles.passportBlurb}>{lv.blurb}</span>
                </div>
              )
            })}
          </div>
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
          <QuickLink to="/vocabulary" icon="📖" title="Browse vocabulary" sub={`${allWords.length.toLocaleString()} words, filter by fluency level`} />
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
