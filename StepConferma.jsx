import './StepConferma.css'

const MONTHS_IT = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                   'luglio','agosto','settembre','ottobre','novembre','dicembre']

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${MONTHS_IT[parseInt(m)-1]} ${y}`
}

export default function StepConferma({ booking, codice }) {
  const { servizio, data, ora, nome, cognome, telefono } = booking

  return (
    <div className="conferma-wrapper">
      <div className="conferma-card">
        <div className="conferma-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 className="conferma-title">Appuntamento confermato!</h2>
        <p className="conferma-sub">
          Grazie {nome}, il tuo appuntamento è stato registrato con successo.
        </p>

        <div className="codice-box">
          <span className="codice-label">Codice prenotazione</span>
          <span className="codice-value">{codice}</span>
          <span className="codice-hint">Conserva questo codice — ti servirà in caso di modifica o cancellazione</span>
        </div>

        <div className="detail-list">
          <div className="detail-row">
            <span className="detail-key">Servizio</span>
            <span className="detail-val">{servizio.nome}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Data</span>
            <span className="detail-val">{formatDate(data)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Ora</span>
            <span className="detail-val">{ora.slice(0,5)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Nominativo</span>
            <span className="detail-val">{nome} {cognome}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Telefono</span>
            <span className="detail-val">{telefono}</span>
          </div>
        </div>

        <div className="sede-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div>
            <strong>ACI Brescia</strong><br/>
            Via Enzo Ferrari 4/6, Brescia<br/>
            <a href="tel:03023971">030/23971</a> · <a href="https://wa.me/393317479466">WhatsApp</a>
          </div>
        </div>

        <p className="conferma-nota">
          Per disdire o modificare l'appuntamento contattaci al <strong>030/23971</strong> o via WhatsApp al <strong>331 747 9466</strong>.
        </p>

        <button
          className="btn-primary"
          style={{width: '100%', justifyContent: 'center', marginTop: '8px'}}
          onClick={() => window.location.reload()}
        >
          Prenota un altro appuntamento
        </button>
      </div>
    </div>
  )
}
