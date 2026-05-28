import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import './StepServizio.css'

const CATEGORY_ICONS = {
  'Consulenza Automobilistica': '🚗',
  'Esenzione / Rimborso Tasse Automobilistiche': '📋',
  'Licenze Sportive': '🏁',
  'Patente': '🪪',
}

export default function StepServizio({ selected, onSelect }) {
  const [servizi, setServizi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openCategory, setOpenCategory] = useState(null)

  useEffect(() => {
    loadServizi()
  }, [])

  async function loadServizi() {
    const { data, error } = await supabase
      .from('servizi')
      .select('*')
      .eq('attivo', true)
      .order('categoria')
      .order('nome')

    if (error) {
      setError('Errore nel caricamento dei servizi.')
    } else {
      // Group by category
      const grouped = {}
      data.forEach(s => {
        if (!grouped[s.categoria]) grouped[s.categoria] = []
        grouped[s.categoria].push(s)
      })
      setServizi(grouped)
      // Open first category by default
      const firstCat = Object.keys(grouped)[0]
      if (firstCat) setOpenCategory(firstCat)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="card">
      <div className="loading-state">
        <div className="spinner" />
        <p>Caricamento servizi...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="card">
      <p className="error-msg">{error}</p>
    </div>
  )

  return (
    <div>
      <div className="card">
        <h2 className="step-title">Scegli il servizio</h2>
        <p className="step-subtitle">Seleziona il tipo di pratica per cui desideri prenotare</p>

        <div className="categories">
          {Object.entries(servizi).map(([cat, items]) => (
            <div key={cat} className="category-block">
              <button
                className={`category-header ${openCategory === cat ? 'open' : ''}`}
                onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
              >
                <span className="cat-icon">{CATEGORY_ICONS[cat] || '📁'}</span>
                <span className="cat-name">{cat}</span>
                <span className="cat-count">{items.length}</span>
                <svg className="cat-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {openCategory === cat && (
                <div className="service-list">
                  {items.map(s => (
                    <button
                      key={s.id}
                      className={`service-item ${selected?.id === s.id ? 'selected' : ''}`}
                      onClick={() => onSelect(s)}
                    >
                      <div className="service-info">
                        <span className="service-name">{s.nome}</span>
                        <span className="service-duration">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {s.durata_minuti} min
                        </span>
                      </div>
                      {selected?.id === s.id && (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
