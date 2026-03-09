import { useApp } from '../context/AppContext'
import LooptimerWidget from './LooptimerWidget'
import MoodSwatches from './MoodSwatches'

export default function LeftNav() {
  const { mood, goTo, sessionActive, milestones, toggleMilestone, intention } = useApp()

  return (
    <aside className="leftnav">
      {/* Mood color wash layer */}
      <div
        className="leftnav-color"
        style={{ background: `rgba(${mood.rgb}, 0.38)` }}
      />

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
