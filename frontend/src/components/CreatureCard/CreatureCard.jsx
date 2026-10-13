import React, { useState } from 'react'
import './CreatureCard.css'

export default function CreatureCard({ creature }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="creature-card glass-card">
      <div className="creature-img-wrap">
        {!imgError ? (
          <img
            src={creature.imageUrl}
            alt={creature.name}
            className="creature-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="creature-img-fallback">
            <span>🦑</span>
          </div>
        )}
        <div className="creature-zone-badge">{creature.zoneName}</div>
      </div>

      <div className="creature-body">
        <div className="creature-names">
          <h3 className="creature-name">{creature.name}</h3>
          <p className="creature-sci-name">{creature.scientificName}</p>
        </div>

        <div className="creature-meta">
          <div className="creature-meta-item">
            <span>📍</span>
            <span>{creature.depthRange}</span>
          </div>
          <div className="creature-meta-item">
            <span>🌊</span>
            <span>{creature.habitat}</span>
          </div>
        </div>

        <p className="creature-desc">{creature.description}</p>

        <div className="creature-adaptations">
          <div className="adapt-label">⚡ Adaptations</div>
          <p className="adapt-text">{creature.adaptations}</p>
        </div>
      </div>
    </div>
  )
}
