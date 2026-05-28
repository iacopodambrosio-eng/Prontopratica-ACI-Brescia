import './ProgressBar.css'

const STEPS = ['Servizio', 'Data e ora', 'I tuoi dati', 'Conferma']

export default function ProgressBar({ step }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-steps">
        {STEPS.map((label, i) => {
          const num = i + 1
          const done = num < step
          const active = num === step
          return (
            <div key={num} className={`progress-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <div className="step-circle">
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : num}
              </div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
