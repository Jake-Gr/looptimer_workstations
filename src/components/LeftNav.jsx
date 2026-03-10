import { useApp } from '../context/AppContext'
import LooptimerWidget from './LooptimerWidget'
import MoodSwatches from './MoodSwatches'

function openMiniTimer() {
  const w = 300, h = 220
  const left = Math.max(0, window.screen.width  - w - 20)
  const top  = Math.max(0, window.screen.height - h - 60)
  window.open(
    '/?mini=true',
    'looptimer-mini',
    `width=${w},height=${h},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=no`
  )
}

export default function LeftNav() {
  const { mood, theme, goTo, sessionActive, milestones, toggleMilestone, intention } = useApp()

  // Gradient: strong at bottom (milestones/idle), fades before reaching timer at top
  // Submersive: near-opaque at bottom so the full mood color is visible;
  //             fades to transparent at top so the timer glows against the dark base
  // Dark/Light: subtle tint only
  const isSubmersive = theme === 'submersive'
  const colorStyle = {
    background: isSubmersive
      ? `linear-gradient(to top, rgba(${mood.rgb},1.0) 0%, rgba(${mood.rgb},0.80) 22%, rgba(${mood.rgb},0.30) 55%, rgba(${mood.rgb},0.04) 80%, transparent 100%)`
      : `linear-gradient(to top, rgba(${mood.rgb},0.50) 0%, rgba(${mood.rgb},0.30) 42%, rgba(${mood.rgb},0.07) 72%, transparent 100%)`,
  }

  return (
    <aside className="leftnav">
      {/* Mood color wash layer — gradient fades toward timer */}
      <div className="leftnav-color" style={colorStyle} />

      <LooptimerWidget />

      {/* Float timer into its own corner window */}
      <button className="float-btn" onClick={openMiniTimer} title="Float looptimer">
        <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
          <rect x="1" y="4.5" width="8.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M7 1h6v6M13 1L8 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Float timer
      </button>

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
