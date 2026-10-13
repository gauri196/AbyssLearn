
import React, { useEffect, useMemo, useState } from 'react'
import './OceanEmbed.css'

import { saveOceanEmbedHistory, getOceanEmbedHistory } from '../services/api'

const DEPTHS = [0.50576, 10, 20, 30, 50, 75, 90]

const VARIABLES = [
  { id: 'sst', label: 'Sea-surface temperature', short: 'SST', unit: '°C', color: '#ffb86b' },
  { id: 'sss', label: 'Sea-surface salinity', short: 'SSS', unit: 'PSU', color: '#67e8f9' },
  { id: 'ssh_sla', label: 'Sea-surface height / anomaly', short: 'SSH / SLA', unit: 'm', color: '#a78bfa' },
  { id: 'current_u', label: 'Surface current · east–west', short: 'Current U', unit: 'm/s', color: '#5eead4' },
  { id: 'current_v', label: 'Surface current · north–south', short: 'Current V', unit: 'm/s', color: '#93c5fd' },
  { id: 'wind_u', label: 'Surface wind · east–west', short: 'Wind U', unit: 'm/s', color: '#f9a8d4' },
  { id: 'wind_v', label: 'Surface wind · north–south', short: 'Wind V', unit: 'm/s', color: '#fde68a' },
  
]

const API_URL = '/oceanembed-api'

export default function OceanEmbed() {
  const [status, setStatus] = useState(null)
  const [statusError, setStatusError] = useState(false)
  const [latitude, setLatitude] = useState('15')
  const [longitude, setLongitude] = useState('75')
  const [date, setDate] = useState('2023-10-15')
  const [selectedDepths, setSelectedDepths] = useState([10, 20, 50, 90])
  const [selectedVariables, setSelectedVariables] = useState([])
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [savingHistory, setSavingHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyNotice, setHistoryNotice] = useState('')
  const [results, setResults] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(response => {
        if (!response.ok) throw new Error('OceanEmbed API is unavailable')
        return response.json()
      })
      .then(data => {
        setStatus(data)
        setStatusError(false)
      })
      .catch(() => setStatusError(true))
  }, [])

  const validCoordinates =
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    Number(latitude) >= 5 &&
    Number(latitude) <= 30 &&
    Number(longitude) >= 45 &&
    Number(longitude) <= 105

  const gridCells = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => ({
        id: i,
        intensity: (Math.sin(i * 1.7) + Math.cos(i * 0.39) + 2) / 4,
      })),
    []
  )

  const toggleVariable = id => {
    setSelectedVariables(previous =>
      previous.includes(id)
        ? previous.filter(value => value !== id)
        : [...previous, id]
    )
  }

  const toggleDepth = depth => {
    setSelectedDepths(previous =>
      previous.includes(depth)
        ? previous.filter(value => value !== depth)
        : [...previous, depth].sort((a, b) => a - b)
    )
  }
  
const handleSaveHistory = async () => {
  if (!results) {
    setHistoryNotice('Run a temperature estimate first.')
    return
  }

  setSavingHistory(true)
  setHistoryNotice('')

  try {
    const response = await saveOceanEmbedHistory({
      date: results.date,
      latitude: Number(results.latitude),
      longitude: Number(results.longitude),
      predictions: results.predictions,
    })

    setHistoryNotice(response.data.message || 'Prediction saved successfully.')
    await handleLoadHistory()
  } catch (error) {
    setHistoryNotice(
      error.response?.data?.message ||
      'Could not save history. Please log in and try again.'
    )
  } finally {
    setSavingHistory(false)
  }
}

const handleLoadHistory = async () => {
  setHistoryLoading(true)
  setHistoryNotice('')

  try {
    const response = await getOceanEmbedHistory()
    setHistory(Array.isArray(response.data) ? response.data : [])
  } catch (error) {
    setHistoryNotice(
      error.response?.data?.message ||
      'Could not load history. Please log in and try again.'
    )
  } finally {
    setHistoryLoading(false)
  }
}

  const handleRequest = async () => {
    if (!validCoordinates) {
      setNotice('Enter coordinates inside the supported study region.')
      return
    }

    if (!date || selectedDepths.length === 0) {
      setNotice('Choose a date and at least one depth.')
      return
    }

    setLoading(true)
    setNotice('')
    setResults(null)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          latitude: Number(latitude),
          longitude: Number(longitude),
          // The current prototype does not use these variables as features.
          variables: [],
          depths_m: selectedDepths,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail || 'Prediction request failed')
        )
      }

      setResults(data)
      setNotice('Estimates received successfully from the OceanEmbed API.')
    } catch (error) {
      setNotice(
        `Could not obtain estimates: ${error.message}. Check that the OceanEmbed API is running on port 8090 and that the Vite proxy is configured.`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="oe-page page-wrapper">
      <section className="oe-hero container">
        <div className="oe-hero-copy">
          <div className="oe-eyebrow">
            <span className="oe-pulse" /> RESEARCH MODULE · NORTH INDIAN OCEAN
          </div>
          <h1>Ocean<span>Embed</span></h1>
          <p className="oe-subtitle">
            Explore prototype estimates of subsurface ocean temperature
            using a model trained on ocean reanalysis data.
          </p>
          <div className="oe-hero-tags">
            <span>Daily fields</span>
            <span>0.25° source grid</span>
            <span>Prototype model</span>
          </div>
        </div>
        <div className="oe-orbit-art" aria-hidden="true">
          <div className="oe-orbit oe-orbit-a" />
          <div className="oe-orbit oe-orbit-b" />
          <div className="oe-globe"><span>🌐</span></div>
          <i className="oe-dot oe-dot-a" />
          <i className="oe-dot oe-dot-b" />
          <i className="oe-dot oe-dot-c" />
        </div>
      </section>

      <section className="container oe-status-grid" aria-label="Module status">
        <article className="oe-stat-card">
          <span className="oe-stat-icon">⌖</span>
          <div><small>Study region</small><strong>5°–30° N</strong><span>45°–105° E</span></div>
        </article>
        <article className="oe-stat-card">
          <span className="oe-stat-icon">▦</span>
          <div><small>Source grid</small><strong>0.25°</strong><span>Daily reanalysis data</span></div>
        </article>
        <article className="oe-stat-card">
          <span className="oe-stat-icon">⇣</span>
          <div><small>Prediction depths</small><strong>0.5–90 m</strong><span>Within training range</span></div>
        </article>
        <article className="oe-stat-card">
          <span className="oe-stat-icon">◉</span>
          <div>
            <small>API status</small>
            <strong className="oe-status-value">
              {statusError ? 'Unavailable' : status?.model_loaded ? 'Model loaded' : status ? 'Setup required' : 'Checking…'}
            </strong>
            <span>{status?.research_stage || 'Connecting to service'}</span>
          </div>
        </article>
      </section>

      <section className="container oe-main-grid">
        <div className="oe-panel oe-config-panel">
          <div className="oe-panel-heading">
            <div><span className="oe-kicker">01 / CONFIGURE</span><h2>Temperature estimation</h2></div>
            <span className="oe-step-number">01</span>
          </div>
          <p className="oe-muted">
            Choose a location, date and one or more depths for the current
            research prototype.
          </p>

          <div className="oe-form-grid">
            <label>
              Latitude (°N)
              <input type="number" min="5" max="30" step="0.25" value={latitude}
                onChange={event => setLatitude(event.target.value)} />
            </label>
            <label>
              Longitude (°E)
              <input type="number" min="45" max="105" step="0.25" value={longitude}
                onChange={event => setLongitude(event.target.value)} />
            </label>
            <label className="oe-date-field">
              Date
              <input type="date" value={date} onChange={event => setDate(event.target.value)} />
            </label>
          </div>

          {!validCoordinates && (
            <p className="oe-validation">Coordinates must be within 5–30°N and 45–105°E.</p>
          )}

          <div className="oe-variable-heading">
            <h3>Planned surface input variables</h3>
            <button type="button" onClick={() => setSelectedVariables(
              selectedVariables.length === VARIABLES.length ? [] : VARIABLES.map(v => v.id)
            )}>
              {selectedVariables.length === VARIABLES.length ? 'Clear all' : 'Select all'}
            </button>
          </div>

          <div className="oe-variable-list">
            {VARIABLES.map(variable => (
              <label className={`oe-variable ${selectedVariables.includes(variable.id) ? 'selected' : ''}`} key={variable.id}>
                <input type="checkbox" checked={selectedVariables.includes(variable.id)}
                  onChange={() => toggleVariable(variable.id)} />
                <span className="oe-checkmark">✓</span>
                <span className="oe-variable-dot" style={{ background: variable.color }} />
                <span className="oe-variable-name">
                  <strong>{variable.short}</strong><small>{variable.label}</small>
                </span>
                <span className="oe-unit">{variable.unit}</span>
              </label>
            ))}
          </div>

          <p className="oe-muted" style={{ marginTop: 12 }}>
            These are planned research inputs only. The current model does not
            consume the selected variables.
          </p>

          <div className="oe-variable-heading"><h3>Depths to estimate</h3></div>
          <div className="oe-variable-list">
            {DEPTHS.map(value => (
              <label className={`oe-variable ${selectedDepths.includes(value) ? 'selected' : ''}`} key={value}>
                <input type="checkbox" checked={selectedDepths.includes(value)}
                  onChange={() => toggleDepth(value)} />
                <span className="oe-checkmark">✓</span>
                <span className="oe-variable-name"><strong>{value} m</strong></span>
              </label>
            ))}
          </div>

          <button className="oe-run-button" disabled={!validCoordinates || !date || selectedDepths.length === 0 || loading}
            onClick={handleRequest}>
            <span>◈</span> {loading ? 'Requesting estimates…' : 'Run temperature estimate'} <span>→</span>
          </button>

          {notice && <div className="oe-notice" role="status">{notice}</div>}
        </div>

        <div className="oe-right-stack">
          <article className="oe-panel oe-map-panel">
            <div className="oe-panel-heading">
              <div><span className="oe-kicker">02 / STUDY AREA</span><h2>North Indian Ocean</h2></div>
              <span className="oe-live-label"><i /> LOCATION PREVIEW</span>
            </div>
            <div className="oe-map-visual">
              <div className="oe-map-grid">
                {gridCells.map(cell => (
                  <span key={cell.id} style={{
                    background: `rgba(52,211,195,${0.04 + cell.intensity * 0.2})`,
                  }} />
                ))}
              </div>
              <span className="oe-land oe-land-india">INDIA</span>
              <span className="oe-land oe-land-arabia">ARABIAN PENINSULA</span>
              <span className="oe-land oe-land-sri">SRI LANKA</span>
              <span className="oe-map-lat oe-lat-top">30°N</span>
              <span className="oe-map-lat oe-lat-bottom">5°N</span>
              <span className="oe-map-lon oe-lon-left">45°E</span>
              <span className="oe-map-lon oe-lon-right">105°E</span>
              <span className="oe-location-marker" style={{
                top: `${100 - ((Number(latitude) - 5) / 25) * 100}%`,
                left: `${((Number(longitude) - 45) / 60) * 100}%`,
              }}>
                <b>{latitude}°, {longitude}°</b>
              </span>
              <span className="oe-map-disclaimer">Schematic preview · not satellite imagery</span>
            </div>
            <div className="oe-map-footer">
              <span><i className="oe-legend-dot" /> Selected coordinate</span>
              <span>0.25° source grid</span>
            </div>
          </article>

          <article className="oe-panel oe-depth-panel">
            <div className="oe-panel-heading">
              <div><span className="oe-kicker">03 / RESULTS</span><h2>Temperature profile</h2></div>
            </div>
            {!results ? (
              <p className="oe-muted">Run an estimate to see temperatures returned by the model at your selected depths.</p>
            ) : (
              <>
                <p className="oe-muted">
                  {results.date} · {results.latitude}°N, {results.longitude}°E
                </p>
                <div className="oe-depth-list">
                  {results.predictions.map(item => (
                    <div className="oe-depth-row active" key={item.depth_m}>
                      <span className="oe-depth-number">
                        {item.depth_m} <small>m</small>
                      </span>
                      <div className="oe-depth-track">
                        <span style={{ width: `${Math.max(8, Math.min(100, ((item.estimated_temperature_c + 2) / 32) * 100))}%` }} />
                      </div>
                      <span className="oe-depth-state">
                        {item.estimated_temperature_c.toFixed(2)}°C
                      </span>
                    </div>
                  ))}
                </div>
                <div className="oe-depth-footnote">
                  Model: {results.model_type || 'prototype'} · Reanalysis-based estimate, not independently validated satellite reconstruction.
                </div>
                {results.warning && <p className="oe-muted" style={{ marginTop: 12 }}>{results.warning}</p>}
              </>
            )}
          </article>
        </div>
      </section>

      <section className="container oe-pipeline-section">
      
{results?.warning && (
  <p className="oe-muted" style={{ marginTop: 12 }}>
    {results.warning}
  </p>
)}

<div className="oe-history-actions">
  <button
    type="button"
    className="oe-run-button"
    onClick={handleSaveHistory}
    disabled={savingHistory}
  >
    {savingHistory ? 'Saving...' : 'Save prediction'}
  </button>

  <button
    type="button"
    onClick={handleLoadHistory}
    disabled={historyLoading}
  >
    {historyLoading ? 'Loading...' : 'View saved history'}
  </button>
</div>

{historyNotice && (
  <p className="oe-notice" role="status">{historyNotice}</p>
)}

{history.length > 0 && (
  <div className="oe-history-list">
    <h3>Saved predictions</h3>

    {history.map(item => (
      <article key={item.id} className="oe-history-item">
        <strong>{item.date}</strong>
        <p>
          Coordinates: {item.latitude}, {item.longitude}
        </p>
        <p>
          Depths saved: {item.predictions?.length ?? 0}
        </p>
        <small>Record ID: {item.id}</small>
      </article>
    ))}
  </div>
)}

        <div className="oe-section-title">
          <span className="oe-kicker">RESEARCH PIPELINE</span>
          <h2>From surface signals to subsurface structure</h2>
          <p>The current service is a reanalysis-based prototype. Satellite input integration and independent validation remain future research tasks.</p>
        </div>
        <div className="oe-pipeline">
          {[
            { n: '01', title: 'Collect', desc: 'Acquire satellite and reanalysis data' },
            { n: '02', title: 'Align', desc: 'Quality control, grids and timestamps' },
            { n: '03', title: 'Embed', desc: 'Develop and train feature-based or deep models' },
            { n: '04', title: 'Estimate', desc: 'Generate prototype temperatures by depth' },
            { n: '05', title: 'Validate', desc: 'Evaluate against independent observations' },
          ].map((step, index) => (
            <article className="oe-pipeline-step" key={step.n}>
              <span className="oe-pipeline-n">{step.n}</span>
              <div className="oe-pipeline-line" />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {index < 4 && <span className="oe-pipeline-arrow">→</span>}
            </article>
          ))}
        </div>
        <div className="oe-validation-banner">
          <span className="oe-validation-symbol">!</span>
          <div>
            <h2>Research limitation</h2>
            <p>
              The current Random Forest uses latitude, longitude, depth and day
              of year. Selecting surface variables in this interface does not
              feed them into the model. Do not interpret the estimates as
              validated satellite-based reconstruction.
            </p>
            <div className="oe-validation-chips">
              <span>Reanalysis-trained</span><span>Prototype estimates</span><span>Independent validation needed</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="container oe-footer">
        OCEANEMBED <span>·</span> ABYSSLEARN
        <small>Ocean temperature research workspace</small>
      </footer>
    </main>
  )
}
