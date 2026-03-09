import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function Close() {
  const { screen, milestones, endBack, totalSecs } = useApp()
  const [reflect, setReflect] = useState(null)

  const mins = Math.round(totalSecs / 60)

  return (
    <div className={`screen${screen === 'close' ? ' active' : ''}`} id="close">
      <div className="close-card">
        <div>
          <div className="close-eyebrow">Session complete</div>
          <div className="close-title">You did that. 🎯</div>
          <div className="close-sub">{mins} minutes of real work.</div>
        </div>

        <div className="close-ms">
          {milestones.length > 0 ? milestones.map(m => (
            <div key={m.id} className="cm-row">
              <div className={`cm-dot${m.done ? ' done' : ' skip'}`}>{m.done ? '✓' : '→'}</div>
              <span className={m.done ? 'cm-done' : ''}>{m.text}</span>
            </div>
          )) : (
            <>
              <div className="cm-row"><div className="cm-dot done">✓</div><span className="cm-done">Write pricing doc</span></div>
              <div className="cm-row"><div className="cm-dot done">✓</div><span className="cm-done">Outline streak mechanics</span></div>
              <div className="cm-row"><div className="cm-dot skip">→</div><span>Draft referral copy</span></div>
            </>
          )}
        </div>

        <div>
          <div className="reflect-q">How did that feel?</div>
          <div className="reflect-opts">
            {[
              { em: '⚡', label: 'Locked in' },
              { em: '😌', label: 'Okay' },
              { em: '😤', label: 'Struggled' },
            ].map(r => (
              <div
                key={r.label}
                className={`ro${reflect === r.label ? ' sel' : ''}`}
                onClick={() => setReflect(r.label)}
              >
                <span className="ro-em">{r.em}</span>
                {r.label}
              </div>
            ))}
          </div>
        </div>

        <div className="streak-row">
          <div className="sr-flame">🔥</div>
          <div>
            <div className="sr-label">Streak</div>
            <div className="sr-val">13 days</div>
          </div>
          <div className="sr-bar">
            <div className="sr-track"><div className="sr-fill" /></div>
            <div className="sr-note">167 days to free year</div>
          </div>
        </div>

        <button className="close-btn" onClick={() => { setReflect(null); endBack() }}>
          Back to my rig →
        </button>
      </div>
    </div>
  )
}
