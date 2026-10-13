import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Zones from './pages/Zones'
import Creatures from './pages/Creatures'
import Quiz from './pages/Quiz'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OceanEmbed from './pages/OceanEmbed'
import './index.css'

function AppContent() {
  const { notification } = useApp()
  return (
    <>
      <Navbar />
      {notification && (
        <div
          className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 9999,
            maxWidth: '360px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'slideInNotif 0.3s ease'
          }}
        >
          {notification.message}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/creatures" element={<Creatures />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oceanembed" element={<OceanEmbed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={
          <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
            <div>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌊</div>
              <h2>404 – Lost in the Abyss</h2>
              <p style={{ marginTop: '12px', marginBottom: '24px' }}>The page you're looking for is deep underwater.</p>
              <a href="/" className="btn btn-primary">← Back to Surface</a>
            </div>
          </div>
        } />
      </Routes>

      <style>{`
        @keyframes slideInNotif {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}
