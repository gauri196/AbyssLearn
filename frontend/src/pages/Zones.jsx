import React, { useState, useEffect } from 'react'
import OceanZoneCard from '../components/OceanZoneCard/OceanZoneCard'
import { getZones } from '../services/api'
import './Zones.css'

export default function Zones() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getZones()
      .then(res => setZones(res.data))
      .catch(() => setError('Failed to load ocean zones. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-container">
        <div className="spinner" />
        <p>Diving deeper...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="page-wrapper container">
      <div className="alert alert-error" style={{ marginTop: 40 }}>{error}</div>
    </div>
  )

  return (
    <div className="page-wrapper zones-page">
      <div className="zones-hero">
        <div className="container">
          <div className="page-header">
            <h1>🌊 Ocean Zones</h1>
            <p>Scroll down to dive deeper into the ocean — from sunlit shallows to the crushing hadal depths</p>
          </div>
        </div>
      </div>

      <div className="zones-depth-bg" aria-hidden="true">
        <div className="depth-gradient" />
      </div>

      <div className="container zones-timeline">
        <div className="dive-label">⬇ Start Diving ⬇</div>
        {zones.map((zone, i) => (
          <OceanZoneCard key={zone.id} zone={zone} index={i} />
        ))}
        <div className="dive-end">
          <div className="dive-end-icon">🔱</div>
          <p>You've reached the deepest point on Earth.</p>
        </div>
      </div>
    </div>
  )
}
