import { useApp } from '../../context/AppContext'

const WORKSTATIONS = [
  { icon: '🎯', name: 'Deep Work',  tools: 'Notion · Claude · 25 min', c: 'orange', active: true },
  { icon: '✍️', name: 'Writing',    tools: 'Docs · Claude · 50 min',   c: 'blue' },
  { icon: '📬', name: 'Admin',      tools: 'Gmail · Cal · 25 min',     c: 'amber' },
  { icon: '💻', name: 'Coding',     tools: 'VS Code · Jira · 90 min',  c: 'green' },
  { icon: '✦',  name: 'Creative',   tools: 'Figma · Notion · 45 min',  c: 'purple' },
  { icon: '📹', name: 'Meeting',    tools: 'Zoom · Notes',             c: 'rose' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning.'
  if (h < 17) return 'Good afternoon.'
  return 'Good evening.'
}

function getDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  const { screen, goTo } = useApp()

  return (
    <div className={`screen${screen === 'dash' ? ' active' : ''}`} id="dash">
      <div className="dash-eyebrow">{getDate()}</div>
      <div className="dash-title">
        {getGreeting()}<br />
        <em>Let's get to work.</em>
      </div>
      <div className="dash-sub">Your rig is ready. Pick a workstation and go.</div>

      <div className="stats-row">
        <div className="stat-card"><div className="sc-val">3h 20m</div><div className="sc-label">Today's focus</div></div>
        <div className="stat-card"><div className="sc-val" style={{ color: '#D4920A' }}>12</div><div className="sc-label">Day streak 🔥</div></div>
        <div className="stat-card"><div className="sc-val" style={{ color: '#4AAA6A' }}>5</div><div className="sc-label">Sessions done</div></div>
        <div className="stat-card"><div className="sc-val" style={{ color: '#9B7AFF' }}>87%</div><div className="sc-label">Focus score</div></div>
      </div>

      <div className="section-hd">
        <div className="section-title">Workstations</div>
        <button className="section-cta" onClick={() => goTo('intent')}>+ New session →</button>
      </div>

      <div className="rig-grid">
        {WORKSTATIONS.map(w => (
          <div key={w.name} className={`rig-card${w.active ? ' active' : ''}`} data-c={w.c}>
            <span className="rc-icon">{w.icon}</span>
            <div className="rc-name">{w.name}</div>
            <div className="rc-tools">{w.tools}</div>
            <button className="rc-launch" onClick={() => goTo('intent')}>Launch →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
