import { useEffect } from 'react'
import { useApp, MOODS } from '../context/AppContext'
import LooptimerWidget from './LooptimerWidget'

export default function MiniTimer() {
  const { mood, moodIdx, setMoodIdx, theme, setTheme } = useApp()

  useEffect(() => { document.title = 'Looptimer' }, [])

  function cycleTheme() {
    const order = ['dark', 'light', 'submersive']
    setTheme(order[(order.indexOf(theme) + 1) % 3])
  }

  const themeIcon = theme === 'submersive' ? '◉' : theme === 'light' ? '☀' : '🌙'

  return (
    <div className="mini-app">
      {/* Submersive colored border overlay */}
      {theme === 'submersive' && <div className="mini-sub-border" />}

      {/* Header: logo + theme cycle + mood swatches */}
      <div className="mini-header">
        <div className="mini-brand">
          <div className="mini-logo-sq">
            <svg viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.50)" strokeWidth="1.8"/>
              <path d="M7 2 A5 5 0 0 1 12 7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="mini-brand-name">Looptimer</span>
        </div>

        <button className="mini-theme-btn" onClick={cycleTheme} title={`Theme: ${theme}`}>
          {themeIcon}
        </button>

        <div className="mini-swatches">
          {MOODS.map((m, i) => (
            <div
              key={m.name}
              className={`mini-swatch${moodIdx === i ? ' active' : ''}`}
              style={{ background: m.color }}
              title={m.name}
              onClick={() => setMoodIdx(i)}
            />
          ))}
        </div>
      </div>

      {/* Timer body */}
      <div className="mini-body">
        <div className="mini-widget-wrap">
          <LooptimerWidget />
        </div>
      </div>
    </div>
  )
}
