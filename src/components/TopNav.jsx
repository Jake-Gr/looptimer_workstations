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

const THEME_OPTS = [
  { key: 'submersive', label: 'Sub' },
  { key: 'light',      label: 'Light' },
  { key: 'dark',       label: 'Dark' },
]

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

export default function TopNav() {
  const { screen, goTo, theme, setTheme, mood, activeTool, setActiveTool, selectedRig, setSelectedRig } = useApp()
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
              onClick={() => setActiveTool(t.key)}
            >
              <span className={`ts-badge ${t.badgeCls}`}>{t.badge}</span>
              {t.label}
            </button>
          ))}
          <div className="ts-sep" />
          <button
            className={`ts-btn${activeTool === 'figma' ? ' active' : ''}`}
            onClick={() => setActiveTool('figma')}
          >
            <span className="ts-badge figma">F</span>
            Figma
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="topnav-right">
        {/* Float timer in its own window */}
        <button className="popout-btn" onClick={openMiniTimer} title="Float looptimer">
          <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
            <rect x="1" y="4.5" width="8.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7 1h6v6M13 1L8 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 3-way theme segmented control */}
        <div className="theme-seg">
          {THEME_OPTS.map(({ key, label }) => (
            <button
              key={key}
              className={`theme-seg-btn${theme === key ? ' active' : ''}`}
              onClick={() => setTheme(key)}
            >
              {label}
            </button>
          ))}
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
