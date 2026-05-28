import { useState } from 'react'
import { supabase } from '../supabase.js'
import './StepForm.css'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'ACI-' + Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const MONTHS_IT = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                   'luglio','agosto','settembre','ottobre','novembre','dicembre']

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${MONTHS_IT[parseInt(m)-1]} ${y}`
}

export default function StepForm({ booking, onChange, onSubmit, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { servizio, data, ora, nome, cognome, telefono, email, note } = booking

  const valid = nome.trim() && cognome.trim() && telefono.trim().length >= 6

  async function handleSubmit() {
    if (!valid) return
    setLoading(true)
    setError(null)

    const codice = generateCode()

    const { error: err } = await supabase.from('prenotazioni').insert({
      codice,
      servizio_id: servizio.id,
      data_appuntamento: data,
      ora_inizio: ora,
      nome_cliente: nome.trim(),
      cognome_cliente: cognome.trim(),
      telefono: telefono.trim(),
      email: email.trim() || null,
      note: note.trim() || null,
      stato: 'confermata',
    })

    if (err) {
      setError('Errore durante la prenotazione. Riprova o chiama il 030/23971.')
      setLoading(false)
    } else {
      onSubmit(codice)
    }
  }

  return (
    <div>
      {/* Summary box */}
      <div className="summary-box">
        <div className="summary-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span><strong>{formatDate(data)}</strong> alle <strong>{ora.slice(0,5)}</strong></span>
        </div>
        <div className="summary-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{servizio.nome} ({servizio.durata_minuti} min)</span>
        </div>
      </div>

      <div className="card">
        <h2 className="step-title">I tuoi dati</h2>
        <p className="step-subtitle">Completa con i tuoi dati per confermare l'appuntamento</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Mario"
              value={nome}
              onChange={e => onChange({ nome: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cognome *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Rossi"
              value={cognome}
              onChange={e => onChange({ cognome: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Telefono *</label>
            <input
              className="form-input"
              type="tel"
              placeholder="030 1234567"
              value={telefono}
              onChange={e => onChange({ telefono: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span className="optional">(opzionale)</span></label>
            <input
              className="form-input"
              type="email"
              placeholder="mario@email.it"
              value={email}
              onChange={e => onChange({ email: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note <span className="optional">(opzionale)</span></label>
          <textarea
            className="form-input form-textarea"
            placeholder="Informazioni aggiuntive sulla pratica..."
            value={note}
            onChange={e => onChange({ note: e.target.value })}
            rows={3}
          />
        </div>

        <p className="privacy-note">
          * Campi obbligatori. I dati verranno utilizzati esclusivamente per la gestione dell'appuntamento.
        </p>

        {error && <p className="error-msg" style={{marginTop: '12px'}}>{error}</p>}
      </div>

      <div className="btn-row">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>← Indietro</button>
        <button
          className="btn-primary"
          disabled={!valid || loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <span className="btn-spinner" />
              Conferma in corso...
            </>
          ) : (
            'Conferma appuntamento ✓'
          )}
        </button>
      </div>
    </div>
  )
}
