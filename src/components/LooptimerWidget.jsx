import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const PERIM = 648

export default function LooptimerWidget() {
  const { mood, timerSecs, totalSecs, running, toggleTimer, setDuration, endSession, loopCount } = useApp()
  const [durOpen, setDurOpen] = useState(false)
  const [selPreset, setSelPreset] = useState(25)
  const [customMin, setCustomMin] = useState('')
  const ringRef = useRef(null)

  const progress = totalSecs > 0 ? timerSecs / totalSecs : 1
  const dashoffset = PERIM * (1 - progress)

  const m = Math.floor(timerSecs / 60)
  const s = timerSecs % 60
  const timeStr = `${m}:${String(s).padStart(2, '0')}`

  function applyPreset(mins) {
    setSelPreset(mins)
    setDuration(mins)
    setTimeout(() => setDurOpen(false), 340)
  }

  function applyCustom() {
    const v = parseInt(customMin)
    if (v > 0 && v <= 180) {
      setDuration(v)
      setSelPreset(v)
      setDurOpen(false)
    }
  }

  return (
    <div className="lt-widget">
      <div className="lt-loop-badge">LOOP {loopCount}</div>

      <svg className="lt-svg" viewBox="0 0 176 176" preserveAspectRatio="none">
        <rect className="lt-track" x="6" y="6" width="164" height="164" rx="13" ry="13" />
        <rect
          ref={ringRef}
          className="lt-ring"
          x="6" y="6" width="164" height="164" rx="13" ry="13"
          style={{
            strokeDasharray: PERIM,
            strokeDashoffset: dashoffset,
            stroke: mood.light,
            filter: `drop-shadow(0 0 5px ${mood.color}) drop-shadow(0 0 12px rgba(${mood.rgb},0.5))`,
          }}
        />
      </svg>

      <div className="lt-face">
        <div className="lt-time">{timeStr}</div>
        <div className="lt-sub">minutes</div>
        <div className="lt-btns">
          <div className="lt-btn lt-btn-set" onClick={() => setDurOpen(true)}>Set</div>
          <div
            className={`lt-btn lt-btn-start${running ? ' running' : ''}`}
            style={{
              background:  running ? `rgba(${mood.rgb},0.45)` : `rgba(${mood.rgb},0.28)`,
              borderColor: running ? `rgba(${mood.rgb},0.65)` : `rgba(${mood.rgb},0.45)`,
              boxShadow:   running
                ? `0 0 14px rgba(${mood.rgb},0.35), 0 2px 0 rgba(0,0,0,0.25)`
                : `0 0 10px rgba(${mood.rgb},0.15), 0 2px 0 rgba(0,0,0,0.35)`,
            }}
            onClick={toggleTimer}
          >
            {running ? 'Pause' : 'Start'}
          </div>
          <div className="lt-btn lt-btn-end" onClick={endSession}>End</div>
        </div>
      </div>

      {/* Duration overlay */}
      <div className={`lt-dur-overlay${durOpen ? ' open' : ''}`}>
        <div className="lt-dur-title">Set duration</div>
        <div className="lt-presets">
          {[10, 15, 25, 30, 50, 90].map(mins => (
            <div
              key={mins}
              className={`lt-preset${selPreset === mins ? ' sel' : ''}`}
              onClick={() => applyPreset(mins)}
            >
              {mins}m
            </div>
          ))}
        </div>
        <div className="lt-custom-row">
          <input
            className="lt-custom-in"
            type="number" min="1" max="180" placeholder="min"
            value={customMin}
            onChange={e => setCustomMin(e.target.value)}
          />
          <button className="lt-dur-set" onClick={applyCustom}>Set</button>
        </div>
        <button className="lt-dur-close" onClick={() => setDurOpen(false)}>Done</button>
      </div>
    </div>
  )
}
