import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'

const MOODS = [
  {
    color: '#E55A1E', dark: '#B84010', light: '#FF7D45', rgb: '229,90,30', name: 'Focus',
    sub: {
      bg: '#160804', panel: '#1E0C06', raised: '#280F09', topnav: '#0E0503',
      border: 'rgba(255,140,70,0.10)', border2: 'rgba(255,140,70,0.22)',
      t1: '#FFE8D0', t2: '#C88A60', t3: '#7A4A28', t4: '#3C2014',
      ltface: '#120604', shadow: 'rgba(0,0,0,0.80)',
    },
  },
  {
    color: '#F5C518', dark: '#C49A05', light: '#FFD84A', rgb: '245,197,24', name: 'Energy',
    sub: {
      bg: '#131000', panel: '#1A1500', raised: '#221C00', topnav: '#0D0B00',
      border: 'rgba(255,220,60,0.10)', border2: 'rgba(255,220,60,0.22)',
      t1: '#FFF3C0', t2: '#C8A030', t3: '#7A6010', t4: '#3C3008',
      ltface: '#0F0D00', shadow: 'rgba(0,0,0,0.80)',
    },
  },
  {
    color: '#5B8FFF', dark: '#2E60D4', light: '#8AB2FF', rgb: '91,143,255', name: 'Flow',
    sub: {
      bg: '#010816', panel: '#030C1E', raised: '#061028', topnav: '#01060E',
      border: 'rgba(130,170,255,0.10)', border2: 'rgba(130,170,255,0.22)',
      t1: '#D0E0FF', t2: '#6888C8', t3: '#304878', t4: '#162240',
      ltface: '#010610', shadow: 'rgba(0,0,0,0.80)',
    },
  },
  {
    color: '#4AAA6A', dark: '#2E7A49', light: '#6DC98A', rgb: '74,170,106', name: 'Calm',
    sub: {
      bg: '#031008', panel: '#05160A', raised: '#081D0E', topnav: '#020B05',
      border: 'rgba(90,200,130,0.10)', border2: 'rgba(90,200,130,0.22)',
      t1: '#C8F2D8', t2: '#60A878', t3: '#2E6840', t4: '#142E20',
      ltface: '#020A05', shadow: 'rgba(0,0,0,0.80)',
    },
  },
  {
    color: '#9B7AFF', dark: '#6B48D4', light: '#BBA2FF', rgb: '155,122,255', name: 'Creative',
    sub: {
      bg: '#0C0418', panel: '#120620', raised: '#18082A', topnav: '#080212',
      border: 'rgba(190,150,255,0.10)', border2: 'rgba(190,150,255,0.22)',
      t1: '#ECD8FF', t2: '#9070C8', t3: '#503880', t4: '#281848',
      ltface: '#080112', shadow: 'rgba(0,0,0,0.80)',
    },
  },
]

const SUB_VARS = ['--bg','--panel','--raised','--topnav','--border','--border2','--t1','--t2','--t3','--t4','--lt-face','--shadow']

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

  const timerRef = useRef(null)
  const transRef = useRef(null)

  const mood = MOODS[moodIdx]

  // Apply mood CSS vars + submersive structural vars when needed
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--mood',       mood.color)
    r.style.setProperty('--mood-dark',  mood.dark)
    r.style.setProperty('--mood-light', mood.light)
    r.style.setProperty('--mood-rgb',   mood.rgb)
    r.style.setProperty('--mood-glow',  `rgba(${mood.rgb},0.35)`)
    r.style.setProperty('--mood-soft',  `rgba(${mood.rgb},0.10)`)
    r.style.setProperty('--mood-med',   `rgba(${mood.rgb},0.18)`)

    if (theme === 'submersive') {
      const s = mood.sub
      r.style.setProperty('--bg',       s.bg)
      r.style.setProperty('--panel',    s.panel)
      r.style.setProperty('--raised',   s.raised)
      r.style.setProperty('--topnav',   s.topnav)
      r.style.setProperty('--border',   s.border)
      r.style.setProperty('--border2',  s.border2)
      r.style.setProperty('--t1',       s.t1)
      r.style.setProperty('--t2',       s.t2)
      r.style.setProperty('--t3',       s.t3)
      r.style.setProperty('--t4',       s.t4)
      r.style.setProperty('--lt-face',  s.ltface)
      r.style.setProperty('--shadow',   s.shadow)
    } else {
      // Clear any submersive overrides — let [data-theme="dark/light"] CSS rules take over
      SUB_VARS.forEach(v => r.style.removeProperty(v))
    }
  }, [mood, theme])

  // Apply data-theme attribute
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const goTo = useCallback((id) => setScreen(id), [])

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
      theme, setTheme,
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
