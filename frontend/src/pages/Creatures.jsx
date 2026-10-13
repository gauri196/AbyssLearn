import React, { useState, useEffect } from 'react'
import CreatureCard from '../components/CreatureCard/CreatureCard'
import { getCreatures } from '../services/api'
import './Creatures.css'

const ZONES = ['All', 'Sunlight Zone', 'Twilight Zone', 'Midnight Zone', 'Abyssal Zone', 'Hadal Zone']

export default function Creatures() {
  const [creatures, setCreatures] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [zone, setZone] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCreatures()
      .then(res => {
        setCreatures(res.data)
        setFiltered(res.data)
      })
      .catch(() => setError('Failed to load creatures. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = creatures
    if (zone !== 'All') result = result.filter(c => c.zoneName === zone)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.scientificName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, zone, creatures])

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-container">
        <div className="spinner" />
        <p>Scanning the depths...</p>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>🦑 Deep-Sea Creatures</h1>
        <p>Explore the extraordinary lifeforms that inhabit the darkest corners of our ocean</p>
      </div>

      <div className="container">
        <div className="creatures-filters">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              id="creature-search"
              type="text"
              placeholder="Search creatures..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="creatures-search"
            />
          </div>

          <div className="zone-filters">
            {ZONES.map(z => (
              <button
                key={z}
                className={`zone-filter-btn ${zone === z ? 'active' : ''}`}
                onClick={() => setZone(z)}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🦑</div>
            <p style={{ marginTop: 12 }}>No creatures found matching your search.</p>
          </div>
        ) : (
          <>
            <p className="creatures-count">
              Showing <strong>{filtered.length}</strong> creature{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid-3">
              {filtered.map(c => <CreatureCard key={c.id} creature={c} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
