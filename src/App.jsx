import { useState } from 'react'
import Header from './components/Header.jsx'
import StepServizio from './components/StepServizio.jsx'
import StepData from './components/StepData.jsx'
import StepForm from './components/StepForm.jsx'
import StepConferma from './components/StepConferma.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import './App.css'

export default function App() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    servizio: null,
    data: null,
    ora: null,
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    note: '',
  })
  const [codiceConferma, setCodiceConferma] = useState(null)

  const updateBooking = (data) => setBooking(prev => ({ ...prev, ...data }))

  const goNext = () => setStep(s => s + 1)
  const goBack = () => setStep(s => s - 1)

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="booking-container">
          <ProgressBar step={step} />
          {step === 1 && (
            <StepServizio
              selected={booking.servizio}
              onSelect={(servizio) => { updateBooking({ servizio, data: null, ora: null }); goNext() }}
            />
          )}
          {step === 2 && (
            <StepData
              servizio={booking.servizio}
              selectedData={booking.data}
              selectedOra={booking.ora}
              onSelect={(data, ora) => { updateBooking({ data, ora }); goNext() }}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepForm
              booking={booking}
              onChange={updateBooking}
              onSubmit={(codice) => { setCodiceConferma(codice); goNext() }}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <StepConferma
              booking={booking}
              codice={codiceConferma}
            />
          )}
        </div>
      </main>
      <footer className="footer">
        <p>ACI Brescia — Via Enzo Ferrari 4/6, Brescia — Tel. 030/23971</p>
        <p>Lun–Gio 8:30–17:00 · Ven 8:30–13:00</p>
      </footer>
    </div>
  )
}
