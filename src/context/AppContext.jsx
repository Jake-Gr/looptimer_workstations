import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'

const MOODS = [
  { color: '#E55A1E', dark: '#B84010', light: '#FF7D45', rgb: '229,90,30', name: 'Focus' },
  { color: '#F5C518', dark: '#C49A05', light: '#FFD84A', rgb: '245,197,24', name: 'Energy' },
  { color: '#5B8FFF', dark: '#2E60D4', light: '#8AB2FF', rgb: '91,143,255', name: 'Flow' },
  { color: '#4AAA6A', dark: '#2E7A49', light: '#6DC98A', rgb: '74,170,106', name: 'Calm' },
  { color: '#9B7AFF', dark: '#6B48D4', light: '#BBA2FF', rgb: '155,122,255', name: 'Creative' },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [screen, setScreen]         = useState('dash')
  const [theme, setTheme]           = useState('dark')
  const [moodIdx, setMoodIdx]       = useState(0)
  const [timerSecs, setTimerSecs]   = useState(25 * 60)
  const [totalSecs, setTotalSecs]   = useState(25 * 60)
  const [running, setRunning]       = useState(false)
  const [milestones, setMilestones] = useState([])
  const [intention, setIntention]   = useState('')
  const [sessionActive, setSessionActive] = useState(false)
  const [activeTool, setActiveTool] = useState('notion')
  const [selectedRig, setSelectedRig] = useState({ icon: '🎯', name: 'Deep Work' })
  const [loopCount, setLoopCount]   = useState(1)

  const timerRef    = useRef(null)
  const transRef    = useRef(null)

  const mood = MOODS[moodIdx]

  // Apply mood CSS vars whenever mood changes
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--mood',       mood.color)
    r.style.setProperty('--mood-dark',  mood.dark)
    r.style.setProperty('--mood-light', mood.light)
    r.style.setProperty('--mood-rgb',   mood.rgb)
    r.style.setProperty('--mood-glow',  `rgba(${mood.rgb},0.35)`)
    r.style.setProperty('--mood-soft',  `rgba(${mood.rgb},0.10)`)
    r.style.setProperty('--mood-med',   `rgba(${mood.rgb},0.18)`)
  }, [mood])

  // Apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const goTo = useCallback((id) => setScreen(id), [])
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  const startTimer = useCallback(() => {
    if (timerRef.current) return
    setRunning(true)
    timerRef.current = setInterval(() => {
      setTimerSecs(s => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setRunning(false)
          setScreen('close')
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [])

  const pauseTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
  }, [])

  const toggleTimer = useCallback(() => {
    if (running) pauseTimer()
    else startTimer()
  }, [running, startTimer, pauseTimer])

  const setDuration = useCallback((mins) => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
    setTotalSecs(mins * 60)
    setTimerSecs(mins * 60)
  }, [])

  const endSession = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
    setTimerSecs(totalSecs)
    setSessionActive(false)
    setMilestones([])
    setScreen('dash')
  }, [totalSecs])

  const launchSession = useCallback((intent, msTexts) => {
    setIntention(intent)
    const ms = msTexts.map((text, i) => ({ id: i, text, done: false }))
    setMilestones(ms)
    setSessionActive(true)
    setActiveTool('notion')
    setScreen('session')
  }, [])

  const toggleMilestone = useCallback((id) => {
    setMilestones(prev => {
      const next = prev.map(m => m.id === id ? { ...m, done: !m.done } : m)
      const allDone = next.every(m => m.done)
      if (allDone) {
        setTimeout(() => setScreen('trans'), 700)
      }
      return next
    })
  }, [])

  const startTransition = useCallback(() => {
    setScreen('trans')
    let secs = 60
    const circ = 233
    const fillEl = document.getElementById('trFill')
    const numEl  = document.getElementById('trNum')
    if (fillEl) fillEl.style.strokeDashoffset = circ
    if (numEl)  numEl.textContent = secs

    if (transRef.current) clearInterval(transRef.current)
    transRef.current = setInterval(() => {
      secs--
      const fe = document.getElementById('trFill')
      const ne = document.getElementById('trNum')
      if (ne) ne.textContent = secs
      if (fe) fe.style.strokeDashoffset = circ * (1 - (60 - secs) / 60)
      if (secs <= 0) {
        clearInterval(transRef.current)
        transRef.current = null
        setScreen('session')
      }
    }, 1000)
  }, [])

  const endBack = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
    setTimerSecs(totalSecs)
    setSessionActive(false)
    setMilestones([])
    setScreen('dash')
  }, [totalSecs])

  return (
    <AppContext.Provider value={{
      screen, goTo,
      theme, toggleTheme,
      mood, moodIdx, setMoodIdx, MOODS,
      timerSecs, totalSecs, running,
      toggleTimer, setDuration, endSession,
      milestones, toggleMilestone,
      intention,
      sessionActive,
      activeTool, setActiveTool,
      selectedRig, setSelectedRig,
      loopCount, setLoopCount,
      launchSession,
      startTransition,
      endBack,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
export { MOODS }
