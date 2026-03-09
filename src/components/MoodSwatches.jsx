import { useApp, MOODS } from '../context/AppContext'

export default function MoodSwatches() {
  const { moodIdx, setMoodIdx } = useApp()

  return (
    <div className="mood-sect">
      <div className="nav-label">Focus mood</div>
      <div className="mood-swatches">
        {MOODS.map((m, i) => (
          <div
            key={m.name}
            className={`mood-swatch${moodIdx === i ? ' active' : ''}`}
            style={{ background: m.color }}
            title={m.name}
            onClick={() => setMoodIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}
