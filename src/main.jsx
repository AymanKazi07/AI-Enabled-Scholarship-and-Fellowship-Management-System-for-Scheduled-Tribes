import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.generated.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register(new URL('sw.js', document.baseURI).href).catch(() => {}));
}
