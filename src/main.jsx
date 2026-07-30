import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Tras un deploy, los chunks viejos ya no existen y el import dinámico falla:
// recargamos una vez para obtener el index.html nuevo con los chunks vigentes.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const key = 'chunk-reload'
  const last = Number(sessionStorage.getItem(key) || 0)
  // Como máximo una recarga cada 30s: si el chunk sigue fallando tras
  // recargar (no fue un deploy de por medio), no entrar en bucle.
  if (Date.now() - last > 30000) {
    sessionStorage.setItem(key, String(Date.now()))
    window.location.reload()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
