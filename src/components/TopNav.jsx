import { useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const RIGS = [
  { icon: '🎯', name: 'Deep Work',  tools: 'Notion · Claude' },
  { icon: '✍️', name: 'Writing',    tools: 'Docs · Claude' },
  { icon: '📬', name: 'Admin',      tools: 'Gmail · Calendar' },
  { icon: '💻', name: 'Coding',     tools: 'VS Code · Jira' },
  { icon: '✦',  name: 'Creative',   tools: 'Figma · Notion' },
  { icon: '📹', name: 'Meeting',    tools: 'Zoom · Notes' },
]

const TOOL_ORDER = { notion: 0, claude: 1, figma: 2 }

export default function TopNav() {
  const { screen, goTo, toggleTheme, mood, activeTool, setActiveTool, selectedRig, setSelectedRig } = useApp()
  const pillRef = useRef(null)
  const indRef  = useRef(null)

  const sessionVisible = screen === 'session'

  function posInd() {
    const pill = pillRef.current
    const ind  = indRef.current
    if (!pill || !ind) return
    const active = pill.querySelector('.ts-btn.active')
    if (!active) return
    const pr = pill.getBoundingClientRect()
    const ar = active.getBoundingClientRect()
    ind.style.left  = (ar.left - pr.left + 3) + 'px'
    ind.style.width = (ar.width - 6) + 'px'
  }

  useEffect(() => {
    if (sessionVisible) setTimeout(posInd, 80)
  }, [sessionVisible, activeTool])

  function switchTool(t) {
    setActiveTool(t)
  }

  return (
    <nav className="topnav">
      {/* Logo col */}
      <div className="topnav-logo">
        <div
          className="topnav-logo-color"
          style={{ background: `rgba(${mood.rgb}, 0.42)` }}
        />
        <div className="logo-sq">
          <svg viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.42)" strokeWidth="1.8"/>
            <path d="M7 2 A5 5 0 0 1 12 7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-name">Looptimer</div>
          <div className="logo-sub">Workstations</div>
        </div>
      </div>

      {/* Tool pill — only visible during session */}
      <div className={`tool-switcher${sessionVisible ? ' visible' : ''}`}>
        <div className="ts-pill" ref={pillRef}>
          <div className="ts-ind" ref={indRef} />
          {[
            { key: 'notion', label: 'Notion', badge: 'N', badgeCls: 'notion' },
            { key: 'claude', label: 'Claude', badge: 'C', badgeCls: 'claude' },
          ].map(t => (
            <button
              key={t.key}
              className={`ts-btn${activeTool === t.key ? ' active' : ''}`}
              onClick={() => switchTool(t.key)}
            >
              <span className={`ts-badge ${t.badgeCls}`}>{t.badge}</span>
              {t.label}
            </button>
          ))}
          <div className="ts-sep" />
          <button
            className={`ts-btn${activeTool === 'figma' ? ' active' : ''}`}
            onClick={() => switchTool('figma')}
          >
            <span className="ts-badge figma">F</span>
            Figma
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="topnav-right">
        <div className="theme-toggle" onClick={toggleTheme}>
          <span className="ti moon">🌙</span>
          <span className="ti sun">☀</span>
        </div>
        <div className="rig-wrap">
          <div className="rig-btn">
            <span className="rig-icon">{selectedRig.icon}</span>
            <div>
              <div className="rig-label">My Rig</div>
              <div className="rig-name">{selectedRig.name}</div>
            </div>
            <span className="rig-arrow">▾</span>
          </div>
          <div className="rig-dd">
            {RIGS.map(r => (
              <div
                key={r.name}
                className={`rig-opt${selectedRig.name === r.name ? ' active' : ''}`}
                onClick={() => setSelectedRig({ icon: r.icon, name: r.name })}
              >
                <span className="ro-icon">{r.icon}</span>
                <div>
                  <div className="ro-name">{r.name}</div>
                  <div className="ro-tools">{r.tools}</div>
                </div>
                <div className="ro-dot" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
