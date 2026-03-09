import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'

const CIRC = 233

export default function Transition() {
  const { screen, goTo, milestones } = useApp()
  const [secs, setSecs] = useState(60)
  const [offset, setOffset] = useState(CIRC)
  const intervalRef = useRef(null)

  const isActive = screen === 'trans'

  useEffect(() => {
    if (isActive) {
      setSecs(60)
      setOffset(CIRC)
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          const next = s - 1
          setOffset(CIRC * (1 - (60 - next) / 60))
          if (next <= 0) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            goTo('session')
          }
          return next
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => clearInterval(intervalRef.current)
  }, [isActive])

  // Find last completed milestone and next pending one
  const lastDone = [...milestones].reverse().find(m => m.done)
  const nextPending = milestones.find(m => !m.done)

  return (
    <div className={`screen${isActive ? ' active' : ''}`} id="trans">
      <div className="trans-card">
        <div className="trans-check">✅</div>
        <div className="trans-tag">Milestone complete</div>
        <div className="trans-prev">{lastDone?.text || 'Milestone complete'}</div>

        <div className="trans-ring">
          <svg viewBox="0 0 82 82">
            <circle className="tr-track" cx="41" cy="41" r="37" />
            <circle
              id="trFill"
              className="tr-fill"
              cx="41" cy="41" r="37"
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          <div className="trans-inner">
            <div className="tr-num" id="trNum">{secs}</div>
            <div className="tr-lbl">sec</div>
          </div>
        </div>

        {nextPending && (
          <>
            <div className="trans-next-lbl">Up next</div>
            <div className="trans-next-task">{nextPending.text}</div>
          </>
        )}

        <button className="trans-skip" onClick={() => goTo('session')}>Ready now →</button>
      </div>
    </div>
  )
}
