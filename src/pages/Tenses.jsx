import { useState } from 'react'
import { tensesData } from '../data/tenses'
import styles from './Tenses.module.css'

const NAV = [
  { id: 'all', label: 'All Tenses' },
  { id: 'present', label: 'Présent' },
  { id: 'passe-compose', label: 'Passé Composé' },
  { id: 'imparfait', label: 'Imparfait' },
  { id: 'futur', label: 'Futur Simple' },
  { id: 'futur-proche', label: 'Futur Proche' },
  { id: 'conditionnel', label: 'Conditionnel' },
  { id: 'subjonctif', label: 'Subjonctif' },
  { id: 'plus-que-parfait', label: 'Plus-que-parfait' },
  { id: 'imperatif', label: 'Impératif' },
]

export default function Tenses() {
  const [active, setActive] = useState('all')
  const shown = active === 'all' ? tensesData : tensesData.filter(t => t.id === active)

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Verb Tenses</h1>
      <div className={styles.nav}>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`${styles.navBtn} ${active === n.id ? styles.activeNav : ''}`}
            onClick={() => setActive(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>
      <div className={styles.cards}>
        {shown.map(t => <TenseCard key={t.id} t={t} />)}
      </div>
    </main>
  )
}

function TenseCard({ t }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <p className={styles.tenseName}>{t.name}</p>
        <p className={styles.tenseSignal}>{t.signal}</p>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.when}>
          <strong>When to use it</strong>
          <span dangerouslySetInnerHTML={{ __html: t.when.replace(/\n/g, '<br>') }} />
        </div>

        {t.signals?.length > 0 && (
          <div className={styles.signalSection}>
            <p className={styles.groupLabel}>Signal words</p>
            <div className={styles.chips}>
              {t.signals.map(s => <span key={s} className={styles.chip}>{s}</span>)}
            </div>
          </div>
        )}

        {t.groups.map((g, i) => (
          <div key={i} className={styles.group}>
            <p className={styles.groupLabel}>{g.label}</p>
            {g.tip && <p className={styles.tip}>{g.tip}</p>}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>{g.cols.map((c, j) => <th key={j}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {g.rows.map((row, j) => (
                    <tr key={j}>{row.map((cell, k) => <td key={k} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {t.vs && (
          <div className={styles.vsSection}>
            <p className={styles.groupLabel}>{t.vsTitle || 'Comparison'}</p>
            <div className={styles.vsGrid}>
              {t.vs.map((v, i) => (
                <div key={i} className={`${styles.vsBox} ${i % 2 === 0 ? styles.vsA : styles.vsB}`}>
                  <p className={styles.vsLabel}>{v.label}</p>
                  <p className={styles.vsFr}>{v.fr}</p>
                  <p className={styles.vsEn}>{v.en}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className={styles.groupLabel}>Example sentences</p>
        {t.examples.map((ex, i) => (
          <div key={i} className={styles.exBlock}>
            <p className={styles.exFr}>{ex.fr}</p>
            <p className={styles.exEn}>{ex.en}</p>
            {ex.note && <p className={styles.exNote}>→ {ex.note}</p>}
          </div>
        ))}

        {t.tip && (
          <div className={styles.tipBox}>
            <strong>💡 Study tip</strong>
            <span dangerouslySetInnerHTML={{ __html: t.tip }} />
          </div>
        )}
      </div>
    </div>
  )
}
