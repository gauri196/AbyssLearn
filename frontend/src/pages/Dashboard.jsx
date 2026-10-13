import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressCard from '../components/ProgressCard/ProgressCard'
import { getProgress, getProgressHistory } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    Promise.all([getProgress(), getProgressHistory()])
      .then(([sumRes, histRes]) => {
        setSummary(sumRes.data)
        setHistory(histRes.data)
      })
      .catch(() => {
        setSummary({ quizzesCompleted: 0, highestScore: 0, averagePercentage: 0, latestScore: 0, latestPercentage: 0 })
        setHistory([])
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-container"><div className="spinner" /><p>Loading your progress...</p></div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container dashboard-page">
        <div className="dashboard-header">
          <div className="user-avatar-lg">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <h1>Your Ocean Explorer Progress</h1>
            <p>Welcome back, <strong style={{ color: 'var(--teal-light)' }}>{user?.name}</strong>! Keep diving deeper.</p>
          </div>
        </div>

        <section className="dashboard-section">
          <h2 className="gradient-text">📊 Statistics</h2>
          {summary && <ProgressCard summary={summary} />}
        </section>

        <section className="dashboard-section">
          <div className="section-row">
            <h2 className="gradient-text">📜 Quiz History</h2>
            <button className="btn btn-primary" onClick={() => navigate('/quiz')}>
              🎯 Take New Quiz
            </button>
          </div>

          {history.length === 0 ? (
            <div className="empty-state glass-card" style={{ padding: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌊</div>
              <p>You haven't completed any quizzes yet.</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/quiz')}>
                Start Your First Quiz
              </button>
            </div>
          ) : (
            <div className="history-table-wrap glass-card">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={h.id}>
                      <td>{i + 1}</td>
                      <td><strong>{h.score}/{h.totalQuestions}</strong></td>
                      <td>
                        <div className="pct-bar-wrap">
                          <div className="pct-bar" style={{ width: `${h.percentage}%` }} />
                          <span>{h.percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td>{h.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
