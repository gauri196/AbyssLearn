import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizQuestion from '../components/QuizQuestion/QuizQuestion'
import { getQuizQuestions, gradeQuiz, submitProgress } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import './Quiz.css'

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [phase, setPhase] = useState('loading') // loading | quiz | result
  const [score, setScore] = useState(0)
  const [error, setError] = useState(null)

  const { isAuthenticated } = useAuth()
  const { showNotification } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    getQuizQuestions()
      .then(res => {
        setQuestions(res.data)
        setPhase(res.data.length ? 'quiz' : 'empty')
      })
      .catch(() => {
        setError('Failed to load quiz questions. Make sure the backend is running.')
        setPhase('error')
      })
  }, [])

  const handleAnswer = (key) => {
    setAnswers(prev => ({ ...prev, [current]: key }))
  }

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1)
    } else {
      let finalScore = 0
      let pct = 0
      try {
        // Grade on the server so correct answers are not exposed in the public quiz payload.
        const submission = Object.fromEntries(
          questions.map((question, index) => [question.id, answers[index] || ''])
        )
        const graded = await gradeQuiz(submission)
        finalScore = graded.data.score
        pct = graded.data.percentage
      } catch {
        // The built-in offline sample set still supports a local demo when the API is down.
        if (!questions.some(question => question.correctAnswer)) {
          setError('The quiz service could not grade your answers. Please check the backend and try again.')
          setPhase('error')
          return
        }
        finalScore = questions.reduce((total, question, index) => (
          answers[index] && question.correctAnswer &&
          answers[index].toUpperCase() === question.correctAnswer.toUpperCase()
            ? total + 1 : total
        ), 0)
        pct = questions.length ? Math.round((finalScore / questions.length) * 100) : 0
      }
      setScore(finalScore)
      setPhase('result')

      if (isAuthenticated) {
        try {
          const saved = await submitProgress({ score: finalScore, totalQuestions: questions.length, percentage: pct })
          if (saved.offline) {
            showNotification('Saved on this device only; the server could not be reached.', 'error')
          } else {
            showNotification('Progress saved! 🎉')
          }
        } catch {
          showNotification('Quiz completed, but progress could not be saved.', 'error')
        }
      }
    }
  }

  const restart = () => {
    setCurrent(0)
    setAnswers({})
    setScore(0)
    setPhase('quiz')
  }

  const pct = Math.round((score / questions.length) * 100)

  if (phase === 'loading') return (
    <div className="page-wrapper">
      <div className="loading-container"><div className="spinner" /><p>Loading quiz...</p></div>
    </div>
  )

  if (phase === 'error') return (
    <div className="page-wrapper container">
      <div className="alert alert-error" style={{ marginTop: 40 }}>{error}</div>
    </div>
  )

  if (phase === 'result') return (
    <div className="page-wrapper">
      <div className="quiz-result-page">
        <div className="result-card glass-card">
          <div className={`result-emoji ${pct >= 70 ? 'good' : 'meh'}`}>
            {pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '🌊'}
          </div>
          <h2>Quiz Complete!</h2>
          <div className="result-score">
            <div className="score-big">{score}<span>/{questions.length}</span></div>
            <div className="score-pct">{pct}%</div>
          </div>

          <div className={`result-msg ${pct >= 70 ? 'msg-good' : 'msg-ok'}`}>
            {pct >= 80 ? 'Outstanding! You\'re an Ocean Expert! 🌊' :
             pct >= 60 ? 'Great job! Keep exploring the depths!' :
             'Keep learning! The ocean has many secrets.'}
          </div>

          {!isAuthenticated && (
            <p className="result-login-hint">
              💡 <a onClick={() => navigate('/login')}>Log in</a> to save your progress
            </p>
          )}

          <div className="result-actions">
            <button id="btn-restart-quiz" className="btn btn-primary" onClick={restart}>
              🔄 Try Again
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              📊 Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const q = questions[current]
  const hasAnswer = answers[current] !== undefined

  return (
    <div className="page-wrapper">
      <div className="quiz-page container">
        <div className="page-header">
          <h1>🎯 Ocean Quiz</h1>
          <p>Test your knowledge about the deep ocean</p>
        </div>

        {!isAuthenticated && (
          <div className="alert alert-error quiz-auth-hint">
            ⚠️ You're not logged in. Your progress won't be saved.{' '}
            <a onClick={() => navigate('/login')} style={{ color: 'var(--teal-light)', cursor: 'pointer' }}>
              Login to save scores
            </a>
          </div>
        )}

        <div className="quiz-container glass-card">
          <QuizQuestion
            question={q}
            selectedAnswer={answers[current]}
            onAnswer={handleAnswer}
            questionNumber={current + 1}
            total={questions.length}
          />

          <div className="quiz-nav">
            {current > 0 && (
              <button className="btn btn-outline" onClick={() => setCurrent(p => p - 1)}>
                ← Back
              </button>
            )}
            <button
              id="btn-quiz-next"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {current === questions.length - 1 ? '🏁 Finish Quiz' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
