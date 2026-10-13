import React from 'react'
import './QuizQuestion.css'

export default function QuizQuestion({ question, selectedAnswer, onAnswer, questionNumber, total }) {
  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ]

  return (
    <div className="quiz-question-wrap">
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${(questionNumber / total) * 100}%` }}
        />
      </div>

      <div className="quiz-q-meta">
        <span className="quiz-q-num">Question {questionNumber} of {total}</span>
        <span className="quiz-q-points">🎯 +10 pts</span>
      </div>

      <h3 className="quiz-q-text">{question.question}</h3>

      <div className="quiz-options">
        {options.map(opt => (
          <button
            key={opt.key}
            className={`quiz-option ${selectedAnswer === opt.key ? 'selected' : ''}`}
            onClick={() => onAnswer(opt.key)}
          >
            <span className="option-key">{opt.key}</span>
            <span className="option-text">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
