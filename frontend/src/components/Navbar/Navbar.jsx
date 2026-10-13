import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🌊</span>
          <span className="brand-text">Abyss<span className="brand-accent">Learn</span></span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/zones" className="nav-link" onClick={closeMenu}>Ocean Zones</Link>
          <Link to="/creatures" className="nav-link" onClick={closeMenu}>Creatures</Link>
          <Link to="/quiz" className="nav-link" onClick={closeMenu}>Quiz</Link>
          <Link to="/oceanembed" className="nav-link nav-oceanembed" onClick={closeMenu}>OceanEmbed <span>LAB</span></Link>

          {isAuthenticated ? (
            <div className="nav-user">
              <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                {user.name.split(' ')[0]}
              </Link>
              <button className="btn btn-outline nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
