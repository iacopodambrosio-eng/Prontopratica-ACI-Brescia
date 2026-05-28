import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import './StepData.css'

const DAYS_IT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                   'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toDateStr(date) {
  return date.toISOString().split('T')[0]
}

function isSameDay(a, b) {
  return toDateStr(a) === toDateStr(b)
}

export default function StepData({ servizio, selectedData, selectedOra, onSelect, onBack }) {
  const today = new Date()
  today.setHours(0,0,0,0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(today)
    return d
  })
  const [selectedDay, setSelectedDay] = useState(selectedData ? new Date(selectedData) : null)
  const [selectedTime, setSelectedTime] = useState(selectedOra || null)
  const [slots, setSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Build 35-day calendar grid
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const startDay = new Date(firstOfMonth)
  startDay.setDate(startDay.getDate() - ((startDay.getDay() + 6) % 7)) // Mon start

  const calDays = Array.from({ length: 42 }, (_, i) => addDays(startDay, i))

  useEffect(() => {
    if (selectedDay) loadSlots(selectedDay)
  }, [selectedDay])

  async function loadSlots(date) {
    setLoadingSlots(true)
    setSlots([])
    setSelectedTime(null)

    const dowMap = [0, 1, 2, 3, 4, 5, 6] // js sunday=0
    const jsDay = date.getDay() // 0=sun
    // Convert to our DB: lun=1, mar=2, mer=3, gio=4, ven=5, sab=6, dom=0
    const dbDay = jsDay === 0 ? 0 : jsDay

    const { data: slotData } = await supabase
      .from('slot_disponibili')
      .select('*')
      .eq('attivo', true)
      .eq('giorno_settimana', dbDay)
      .eq('servizio_id', servizio.id)
      .order('ora_inizio')

    // Get already booked for this date
    const dateStr = toDateStr(date)
    const { data: prenotazioni } = await supabase
      .from('prenotazioni')
      .select('ora_inizio')
      .eq('data_appuntamento', dateStr)
      .eq('servizio_id', servizio.id)
      .neq('stato', 'cancellata')

    const booked = (prenotazioni || []).map(p => p.ora_inizio)
    setBookedSlots(booked)
    setSlots(slotData || [])
    setLoadingSlots(false)
  }

  function isAvailable(slot) {
    // Check not already booked
    if (bookedSlots.includes(slot.ora_inizio)) return false
    // Check not in past
    if (selectedDay && isSameDay(selectedDay, today)) {
      const now = new Date()
      const [h, m] = slot.ora_inizio.split(':').map(Number)
      const slotTime = new Date(today)
      slotTime.setHours(h, m, 0, 0)
      if (slotTime <= now) return false
    }
    return true
  }

  function isWorkday(date) {
    const d = date.getDay()
    return d >= 1 && d <= 5 // Mon-Fri only
  }

  function isPast(date) {
    return date < today
  }

  const canProceed = selectedDay && selectedTime

  return (
    <div>
      <div className="card">
        <h2 className="step-title">Scegli data e ora</h2>
        <p className="step-subtitle">Servizio: <strong>{servizio.nome}</strong></p>

        {/* Calendar navigation */}
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => {
            const d = new Date(viewDate)
            d.setMonth(d.getMonth() - 1)
            setViewDate(d)
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="cal-month">
            {MONTHS_IT[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button className="cal-nav-btn" onClick={() => {
            const d = new Date(viewDate)
            d.setMonth(d.getMonth() + 1)
            setViewDate(d)
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="cal-grid cal-header">
          {['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map(d => (
            <div key={d} className="cal-day-header">{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="cal-grid">
          {calDays.map((day, i) => {
            const isCurrentMonth = day.getMonth() === viewDate.getMonth()
            const isToday = isSameDay(day, today)
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            const past = isPast(day)
            const workday = isWorkday(day)
            const disabled = past || !workday || !isCurrentMonth

            return (
              <button
                key={i}
                className={`cal-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                disabled={disabled}
                onClick={() => {
                  setSelectedDay(day)
                  setSelectedTime(null)
                }}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDay && (
        <div className="card">
          <h3 className="slots-title">
            Orari disponibili —{' '}
            {DAYS_IT[selectedDay.getDay()]} {selectedDay.getDate()} {MONTHS_IT[selectedDay.getMonth()]}
          </h3>

          {loadingSlots ? (
            <div className="loading-state">
              <div className="spinner" />
            </div>
          ) : slots.length === 0 ? (
            <p className="no-slots">Nessun orario disponibile per questo giorno.<br/>Scegli un altro giorno.</p>
          ) : (
            <div className="slots-grid">
              {slots.map(slot => {
                const avail = isAvailable(slot)
                const selTime = selectedTime === slot.ora_inizio
                return (
                  <button
                    key={slot.id}
                    className={`slot-btn ${selTime ? 'selected' : ''} ${!avail ? 'booked' : ''}`}
                    disabled={!avail}
                    onClick={() => setSelectedTime(slot.ora_inizio)}
                  >
                    {slot.ora_inizio.slice(0,5)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="btn-row">
        <button className="btn-secondary" onClick={onBack}>← Indietro</button>
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={() => onSelect(toDateStr(selectedDay), selectedTime)}
        >
          Continua →
        </button>
      </div>
    </div>
  )
}
