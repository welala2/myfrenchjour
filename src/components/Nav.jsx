import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import styles from './Nav.module.css'

export default function Nav() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/vocabulary', label: 'Vocabulary' },
    { to: '/tenses', label: 'Tenses' },
    ...(user ? [
      { to: '/quiz', label: 'Quiz' },
      { to: '/dashboard', label: 'Dashboard' },
    ] : [])
  ]

  return (
    <nav className={styles.nav}>
      <Link to={user ? '/dashboard' : '/'} className={styles.logo}>
        <span className={styles.logoJ}>J</span>
        <span className={styles.logoText}>MyFrenchJour</span>
      </Link>

      <div className={styles.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`${styles.link} ${pathname === l.to ? styles.active : ''}`}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className={styles.right}>
        {user ? (
          <button className={styles.signOut} onClick={signOut}>Sign out</button>
        ) : (
          <Link to="/auth" className={styles.signIn}>Sign in</Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {open && (
        <div className={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={styles.mobileLink} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user
            ? <button className={styles.mobileLink} onClick={() => { signOut(); setOpen(false) }}>Sign out</button>
            : <Link to="/auth" className={styles.mobileLink} onClick={() => setOpen(false)}>Sign in</Link>
          }
        </div>
      )}
    </nav>
  )
}
