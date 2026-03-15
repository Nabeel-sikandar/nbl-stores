import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="116939402219-8fnlbklpbpcthbecfohpes3ssv4dong2.apps.googleusercontent.com">
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)