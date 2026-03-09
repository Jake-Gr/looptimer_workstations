import { useApp } from '../../context/AppContext'

const TOOL_ORDER = { notion: 0, claude: 1, figma: 2 }

export default function Session() {
  const { screen, activeTool } = useApp()

  function getTransform(tool) {
    const active = activeTool
    if (tool === active) return 'translateX(0)'
    const diff = TOOL_ORDER[tool] - TOOL_ORDER[active]
    return diff > 0 ? 'translateX(40px)' : 'translateX(-40px)'
  }

  return (
    <div className={`screen${screen === 'session' ? ' active' : ''}`} id="session">
      <div className="tool-stage">

        {/* ── Notion mock ── */}
        <div
          className={`tool-view${activeTool === 'notion' ? ' active' : ''}`}
          id="tv-notion"
        >
          <div className="notion-view">
            <div
              className="nv-title"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
            >
              Looptimer — Pricing Strategy
            </div>
            <div className="nv-body">
              {[86, 72, 91, 57, 79, 88, 64, 82, 49, 76, 90, 63, 85].map((w, i) => (
                <div
                  key={i}
                  className="nv-line"
                  style={{
                    width: `${w}%`,
                    ...(i === 4 ? { height: '18px', marginTop: '14px' } : {}),
                    ...(i === 9 ? { marginTop: '14px' } : {}),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Claude mock ── */}
        <div
          className={`tool-view${activeTool === 'claude' ? ' active' : ''}`}
          id="tv-claude"
        >
          <div className="claude-view">
            <div className="cv-msgs">
              <div className="cv-msg a">Ready when you are. What are we working through today?</div>
              <div className="cv-msg u">Help me think through hardware owner pricing. Free year one, then $79/year.</div>
              <div className="cv-msg a">Strong anchor. Hardware owners have already committed. Free year one signals loyalty without cheapening the software. $79/year is under $7/month — the cost of a coffee run, easy to justify.</div>
              <div className="cv-msg u">What about tying streak milestones to a free renewal?</div>
              <div className="cv-msg a">Make the progress visible from day one. "94 of 180 days toward your free year." That number becomes its own retention mechanic — people open the app on a slow Friday just to protect the streak.</div>
            </div>
            <div className="cv-input">
              <div className="cv-row">
                <input className="cv-field" placeholder="Ask anything…" />
                <div className="cv-send">↑</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Figma mock ── */}
        <div
          className={`tool-view${activeTool === 'figma' ? ' active' : ''}`}
          id="tv-figma"
        >
          <div className="figma-view">
            <div className="figma-icon">🎨</div>
            <div className="figma-label">figma.com — looptimer-workstations.fig</div>
          </div>
        </div>

      </div>
    </div>
  )
}
