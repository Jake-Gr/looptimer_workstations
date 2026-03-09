import { useApp } from '../context/AppContext'
import LooptimerWidget from './LooptimerWidget'
import MoodSwatches from './MoodSwatches'

export default function LeftNav() {
  const { mood, theme, goTo, sessionActive, milestones, toggleMilestone, intention } = useApp()

  // Gradient: strong at bottom (milestones/idle), fades before reaching timer at top
  // Submersive = deeper immersion; dark/light = standard accent
  const isSubmersive = theme === 'submersive'
  const colorStyle = {
    background: isSubmersive
      ? `linear-gradient(to top, rgba(${mood.rgb},0.80) 0%, rgba(${mood.rgb},0.55) 35%, rgba(${mood.rgb},0.18) 68%, rgba(${mood.rgb},0.04) 100%)`
      : `linear-gradient(to top, rgba(${mood.rgb},0.50) 0%, rgba(${mood.rgb},0.30) 42%, rgba(${mood.rgb},0.07) 72%, transparent 100%)`,
  }

  return (
    <aside className="leftnav">
      {/* Mood color wash layer — gradient fades toward timer */}
      <div className="leftnav-color" style={colorStyle} />

      <LooptimerWidget />
      <MoodSwatches />

      {/* Idle state */}
      {!sessionActive && (
        <div className="nav-idle">
          <div className="idle-hint">Start a session to<br />see your milestones</div>
          <button className="idle-cta" onClick={() => goTo('dash')}>
            Choose a workstation →
          </button>
        </div>
      )}

      {/* Milestones — shown when session is active */}
      <div className={`ms-section${sessionActive ? ' active' : ''}`}>
        <div className="nav-label">Milestones</div>
        <div className="ms-goal">
          <div className="ms-goal-label">End result</div>
          <div className="ms-goal-text">{intention || '–'}</div>
        </div>
        <div className="ms-list">
          {milestones.map(m => (
            <div
              key={m.id}
              className={`ms-item${m.done ? ' done' : ''}`}
              onClick={() => toggleMilestone(m.id)}
            >
              <div className="ms-chk">✓</div>
              <div className="ms-txt">{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
