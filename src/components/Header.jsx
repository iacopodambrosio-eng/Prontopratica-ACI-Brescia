import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <img src="/logo-aci.png" alt="ACI Brescia" className="header-logo" />
          <div className="header-text">
            <span className="header-title">ACI Brescia</span>
            <span className="header-sub">Prenota il tuo appuntamento</span>
          </div>
        </div>
        <div className="header-contact">
          <a href="tel:03023971" className="contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 011.12 1.2 2 2 0 013.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            030/23971
          </a>
        </div>
      </div>
      <div className="header-stripe" />
    </header>
  )
}
