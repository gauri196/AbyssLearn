import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const BUBBLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: Math.random() * 60 + 15,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: Math.random() * 10 + 12,
}))

export default function Home() {
  return (
    <div className="home-page">
      {/* Animated Bubbles Background */}
      <div className="bubbles-bg" aria-hidden="true">
        {BUBBLES.map(b => (
          <div
            key={b.id}
            className="bubble"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge"><span className="live-dot" /> DEEP OCEAN EXPLORATION</div>
          <h1 className="hero-title">
            Explore the World<br />
            <span className="gradient-text">Beneath the Surface</span>
          </h1>
          <p className="hero-subtitle">
            Descend through mysterious ocean layers, meet extraordinary life forms, and uncover the science of Earth’s final frontier. Your next discovery is below the surface.
          </p>
          <div className="hero-actions">
            <Link to="/zones" id="btn-explore-ocean" className="btn btn-primary">
              Begin your descent <span aria-hidden="true">↘</span>
            </Link>
            <Link to="/quiz" id="btn-take-quiz" className="btn btn-outline">
              Test your knowledge
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="ocean-orb">
            <div className="orb-glow" />
            <div className="orb-creature">✦</div>
            <div className="orb-caption"><span>THE ABYSS</span><strong>Into the unknown</strong></div>
          </div>
          <div className="depth-indicator">
            {['0m', '200m', '1000m', '4000m', '6000m+'].map((d, i) => (
              <div key={d} className="depth-mark" style={{ animationDelay: `${i * 0.2}s` }}>
                <span className="depth-line" />
                <span className="depth-label">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container">
        <div className="section-title">
          <span className="eyebrow">A WORLD WAITING BELOW</span><h2>Curiosity goes deeper.</h2>
          <p>Explore the layers, life, and science of the least-explored place on our planet.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(feat => (
            <Link to={feat.link} key={feat.title} className="feature-card glass-card">
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
              <span className="feature-cta">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section container">
        <div className="stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-big">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const FEATURES = [
  { icon: '🌊', title: 'Ocean Zones', desc: 'Dive through 5 distinct ocean zones from sunlit shallows to pitch-dark hadal depths.', link: '/zones' },
  { icon: '🦑', title: 'Deep-Sea Creatures', desc: 'Discover 10 fascinating deep-sea creatures with scientific details and adaptations.', link: '/creatures' },
  { icon: '🎯', title: 'Ocean Quiz', desc: 'Test your knowledge with 10 questions about ocean zones, creatures, and deep-sea facts.', link: '/quiz' },
  { icon: '📊', title: 'Track Progress', desc: 'Log in to save your quiz scores and track your learning journey over time.', link: '/dashboard' },
]

const STATS = [
  { value: '5', label: 'Ocean Zones' },
  { value: '10+', label: 'Deep-Sea Creatures' },
  { value: '10', label: 'Quiz Questions' },
  { value: '∞', label: 'Curiosity' },
]
