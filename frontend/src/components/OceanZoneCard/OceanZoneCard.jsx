import React, { useState } from 'react'
import './OceanZoneCard.css'

const ZONE_COLORS = {
  'Sunlight Zone': { gradient: 'linear-gradient(160deg, #0369a1, #0284c7)', icon: '☀️', depth: 0 },
  'Twilight Zone': { gradient: 'linear-gradient(160deg, #075985, #0c4a6e)', icon: '🌙', depth: 1 },
  'Midnight Zone': { gradient: 'linear-gradient(160deg, #1e3a5f, #0f2547)', icon: '🦑', depth: 2 },
  'Abyssal Zone': { gradient: 'linear-gradient(160deg, #0f172a, #1e293b)', icon: '🐙', depth: 3 },
  'Hadal Zone': { gradient: 'linear-gradient(160deg, #020617, #0f172a)', icon: '🔱', depth: 4 },
}

export default function OceanZoneCard({ zone, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = ZONE_COLORS[zone.name] || ZONE_COLORS['Abyssal Zone']
  const isEven = index % 2 === 0

  return (
    <div className={`zone-card ${isEven ? 'left' : 'right'}`} style={{ '--zone-gradient': meta.gradient }}>
      <div className="zone-connector">
        <div className="zone-dot" />
        {index > 0 && <div className="zone-line" />}
      </div>

      <div className="zone-content glass-card">
        <div className="zone-header">
          <div className="zone-icon">{meta.icon}</div>
          <div>
            <h3 className="zone-name">{zone.name}</h3>
            <span className="zone-depth-badge">
              {zone.minDepth === 0 ? '0' : zone.minDepth.toLocaleString()}m – {zone.maxDepth >= 11000 ? '11,000m+' : zone.maxDepth.toLocaleString() + 'm'}
            </span>
          </div>
        </div>

        <p className="zone-desc">{zone.description}</p>

        <div className="zone-stats">
          <div className="zone-stat">
            <span className="stat-icon">🌡️</span>
            <div>
              <div className="stat-label">Temperature</div>
              <div className="stat-value">{zone.temperature}</div>
            </div>
          </div>
          <div className="zone-stat">
            <span className="stat-icon">⚖️</span>
            <div>
              <div className="stat-label">Pressure</div>
              <div className="stat-value">{zone.pressure}</div>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="zone-extra">
            <div className="zone-organisms">
              <div className="stat-label">🐠 Common Organisms</div>
              <p>{zone.organisms}</p>
            </div>
            <div className="zone-fact">
              <div className="stat-label">💡 Interesting Fact</div>
              <p className="fact-text">{zone.interestingFact}</p>
            </div>
          </div>
        )}

        <button className="zone-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲ Show Less' : '▼ Learn More'}
        </button>
      </div>
    </div>
  )
}
