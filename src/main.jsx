import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Demo from './Demo.jsx'

const isDemo = window.location.pathname.replace(/\\/$/, '') === '/demo'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isDemo ? <Demo /> : <App />}
  </StrictMode>,
)
