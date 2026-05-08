import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Vocabulary from './pages/Vocabulary'
import Quiz from './pages/Quiz'
import Tenses from './pages/Tenses'
import Dashboard from './pages/Dashboard'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner /></div>
  return user ? children : <Navigate to="/auth" replace />
}

function Spinner() {
  return <div style={{ width: 32, height: 32, border: '3px solid #c8bfae', borderTopColor: '#3a6b8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner /></div>

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/tenses" element={<Tenses />} />
        <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}
