import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

const stats = [
  { n: '1,860', label: 'Active words' },
  { n: '9', label: 'Verb tenses' },
  { n: 'SM-2', label: 'Spaced repetition' },
  { n: '∞', label: 'Free forever' },
]

export default function Landing() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Learn French — every day</p>
          <h1 className={styles.headline}>
            <em>Vocabulaire</em><br />
            Français
          </h1>
          <p className={styles.sub}>
            1,860 hand-selected words. Verb tenses. A quiz that learns what you know
            and drills what you don't. No ads. No subscriptions.
          </p>
          <div className={styles.cta}>
            <Link to="/auth" className={styles.ctaPrimary}>Start learning — it's free</Link>
            <Link to="/vocabulary" className={styles.ctaSecondary}>Browse vocabulary →</Link>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.cardInner}>
            <p className={styles.cardFr}>apprendre</p>
            <p className={styles.cardLine}>—</p>
            <p className={styles.cardEn}>to learn</p>
            <p className={styles.cardEx}>J'apprends le français depuis six mois.</p>
            <p className={styles.cardExEn}>I've been learning French for six months.</p>
            <div className={styles.cardBtns}>
              <button className={styles.cardBtnKnown}>✓ Known</button>
              <button className={styles.cardBtnReview}>★ Review</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        {stats.map(s => (
          <div key={s.n} className={styles.stat}>
            <span className={styles.statN}>{s.n}</span>
            <span className={styles.statL}>{s.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.features}>
        <Feature
          icon="📖"
          title="Complete vocabulary"
          body="1,860 words across 22 categories — verbs, nouns, adjectives, phrases, idioms, culture, and more. Every entry has a French example sentence."
        />
        <Feature
          icon="⏱"
          title="All 9 verb tenses"
          body="Présent, passé composé, imparfait, futur, conditionnel, subjonctif — every tense with conjugation tables, signal words, and examples."
        />
        <Feature
          icon="🃏"
          title="Spaced repetition quiz"
          body="The SM-2 algorithm (the same one Anki uses) shows you words exactly when you're about to forget them. Study smarter, not longer."
        />
        <Feature
          icon="✓"
          title="Mark what you know"
          body="Mark words as Known or For Review. Your progress syncs across every device. Come back tomorrow and pick up where you left off."
        />
      </section>

      <footer className={styles.footer}>
        <p>MyFrenchJour · Built for French learners · Free forever</p>
      </footer>
    </main>
  )
}

function Feature({ icon, title, body }) {
  return (
    <div className={styles.feature}>
      <span className={styles.featureIcon}>{icon}</span>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureBody}>{body}</p>
    </div>
  )
}
