import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import styles from './Auth.module.css'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password)
        if (error) throw error
        setMessage('Check your email to confirm your account, then sign in.')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logoJ}>J</span>
          <h1 className={styles.title}>MyFrenchJour</h1>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'signin' ? styles.active : ''}`} onClick={() => { setMode('signin'); setError(''); setMessage('') }}>Sign in</button>
          <button className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`} onClick={() => { setMode('signup'); setError(''); setMessage('') }}>Create account</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={6}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Loading...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className={styles.note}>
          {mode === 'signup'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <button className={styles.switch} onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setMessage('') }}>
            {mode === 'signup' ? 'Sign in' : 'Create one — it\'s free'}
          </button>
        </p>
      </div>
    </main>
  )
}
