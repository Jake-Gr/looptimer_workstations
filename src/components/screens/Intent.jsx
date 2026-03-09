import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function Intent() {
  const { screen, goTo, launchSession } = useApp()
  const [intentText, setIntentText] = useState('')
  const [milestones, setMilestones] = useState([
    { id: 1, value: '' },
    { id: 2, value: '' },
  ])
  const [nextId, setNextId] = useState(3)

  function addMb() {
    setMilestones(prev => [...prev, { id: nextId, value: '' }])
    setNextId(n => n + 1)
  }

  function rmMb(id) {
    setMilestones(prev => prev.filter(m => m.id !== id))
  }

  function updateMb(id, value) {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, value } : m))
  }

  function handleLaunch() {
    const intent = intentText.trim() || 'Finish the task'
    const texts  = milestones.map(m => m.value.trim()).filter(Boolean)
    const final  = texts.length ? texts : ['Write pricing doc', 'Outline streak mechanics', 'Draft referral copy']
    launchSession(intent, final)
  }

  return (
    <div className={`screen${screen === 'intent' ? ' active' : ''}`} id="intent">
      <div className="intent-card">
        <div>
          <div className="intent-eyebrow">Before we begin</div>
          <div className="intent-q">
            What's your <em>one focus</em><br />this session?
          </div>
        </div>

        <textarea
          className="intent-textarea"
          placeholder="e.g. Nail the pricing strategy before the investor call…"
          rows={3}
          value={intentText}
          onChange={e => setIntentText(e.target.value)}
        />

        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: '7px' }}>
            Milestones
          </div>
          <div className="mb-build">
            {milestones.map((m, i) => (
              <div key={m.id} className="mb-row">
                <span className="mb-n">{i + 1}</span>
                <input
                  className="mb-in"
                  placeholder={`Milestone ${i + 1}…`}
                  value={m.value}
                  onChange={e => updateMb(m.id, e.target.value)}
                />
                <button className="mb-rm" onClick={() => rmMb(m.id)}>×</button>
              </div>
            ))}
          </div>
          <button className="mb-add" style={{ marginTop: '5px' }} onClick={addMb}>
            + Add milestone
          </button>
        </div>

        <div className="intent-nav">
          <button className="intent-back" onClick={() => goTo('dash')}>← Back</button>
          <button className="intent-go" onClick={handleLaunch}>Begin session →</button>
        </div>
      </div>
    </div>
  )
}
