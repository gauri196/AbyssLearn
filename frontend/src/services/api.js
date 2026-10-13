import axios from 'axios'
import { INITIAL_ZONES, INITIAL_CREATURES, INITIAL_QUIZ_QUESTIONS } from '../data/mockData'

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000
})

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('abysslearn_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Authentication must always be verified by the real backend.
// Never create a fake token when the API is unavailable.
export const signup = (data) => API.post('/auth/signup', data)
export const login = (data) => API.post('/auth/login', data)

// Ocean Zones (With automatic graceful fallback)
export const getZones = async () => {
  try {
    const res = await API.get('/zones')
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res
    }
    return { data: INITIAL_ZONES }
  } catch {
    return { data: INITIAL_ZONES }
  }
}

export const getZoneById = async (id) => {
  try {
    return await API.get(`/zones/${id}`)
  } catch {
    const found = INITIAL_ZONES.find(z => z.id === Number(id))
    return { data: found || INITIAL_ZONES[0] }
  }
}

export const createZone = (data) => API.post('/zones', data)
export const updateZone = (id, data) => API.put(`/zones/${id}`, data)
export const deleteZone = (id) => API.delete(`/zones/${id}`)

// Creatures (With automatic graceful fallback)
export const getCreatures = async () => {
  try {
    const res = await API.get('/creatures')
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res
    }
    return { data: INITIAL_CREATURES }
  } catch {
    return { data: INITIAL_CREATURES }
  }
}

export const getCreatureById = async (id) => {
  try {
    return await API.get(`/creatures/${id}`)
  } catch {
    const found = INITIAL_CREATURES.find(c => c.id === Number(id))
    return { data: found || INITIAL_CREATURES[0] }
  }
}

export const createCreature = (data) => API.post('/creatures', data)
export const updateCreature = (id, data) => API.put(`/creatures/${id}`, data)
export const deleteCreature = (id) => API.delete(`/creatures/${id}`)

// Quiz (With automatic graceful fallback)
export const gradeQuiz = (answers) => API.post('/quizzes/submit', { answers })

export const getQuizQuestions = async () => {
  try {
    const res = await API.get('/quizzes')
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res
    }
    return { data: INITIAL_QUIZ_QUESTIONS }
  } catch {
    return { data: INITIAL_QUIZ_QUESTIONS }
  }
}

// Progress (Stores to backend and mirrors to localStorage for offline resilience)
export const getProgress = async () => {
  try {
    return await API.get('/progress')
  } catch {
    const history = JSON.parse(localStorage.getItem('abysslearn_history') || '[]')
    const total = history.length
    const highest = total ? Math.max(...history.map(h => h.score)) : 0
    const avg = total ? Math.round(history.reduce((a, b) => a + b.percentage, 0) / total) : 0
    const latest = total ? history[0] : { score: 0, percentage: 0 }
    return {
      data: {
        quizzesCompleted: total,
        highestScore: highest,
        averagePercentage: avg,
        latestScore: latest.score,
        latestPercentage: latest.percentage
      }
    }
  }
}

export const getProgressHistory = async () => {
  try {
    return await API.get('/progress/history')
  } catch {
    const history = JSON.parse(localStorage.getItem('abysslearn_history') || '[]')
    return { data: history }
  }
}

export const submitProgress = async (data) => {
  // Mirror locally
  const currentHistory = JSON.parse(localStorage.getItem('abysslearn_history') || '[]')
  const newEntry = {
    id: Date.now(),
    score: data.score,
    totalQuestions: data.totalQuestions,
    percentage: data.percentage,
    completedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  localStorage.setItem('abysslearn_history', JSON.stringify([newEntry, ...currentHistory]))

  try {
    return await API.post('/progress', data)
  } catch {
    return { data: newEntry, offline: true }
  }
}

export default API


export const saveOceanEmbedHistory = (data) =>
  API.post('/oceanembed/history', data)

export const getOceanEmbedHistory = () =>
  API.get('/oceanembed/history')
