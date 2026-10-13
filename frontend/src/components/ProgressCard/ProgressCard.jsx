import React from 'react'
import './ProgressCard.css'

export default function ProgressCard({ summary }) {
  const stats = [
    { icon: '📝', label: 'Quizzes Completed', value: summary.quizzesCompleted, color: 'teal' },
    { icon: '🏆', label: 'Highest Score', value: `${summary.highestScore} pts`, color: 'gold' },
    { icon: '📊', label: 'Average Score', value: `${summary.averagePercentage?.toFixed(1)}%`, color: 'blue' },
    { icon: '⚡', label: 'Latest Score', value: `${summary.latestScore} pts`, color: 'cyan' },
  ]

  return (
    <div className="progress-grid">
      {stats.map((stat) => (
        <div key={stat.label} className={`progress-stat-card glass-card accent-${stat.color}`}>
          <div className="stat-emoji">{stat.icon}</div>
          <div className="stat-number">{stat.value}</div>
          <div className="stat-name">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
