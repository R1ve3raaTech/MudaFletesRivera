import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tras un deploy, los chunks viejos ya no existen y el import dinámico falla:
// recargamos una vez para obtener el index.html nuevo con los chunks vigentes.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const key = 'chunk-reload'
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1')
    window.location.reload()
  }
})
window.addEventListener('load', () => sessionStorage.removeItem('chunk-reload'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
