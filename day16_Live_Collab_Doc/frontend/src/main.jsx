import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Quick helper to generate a random 10-character ID
const generateId = () => Math.random().toString(36).substring(2, 12);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Redirect root to a new random document ID */}
        <Route path="/" element={<Navigate to={`/document/${generateId()}`} replace />} />
        {/* Load the App for specific document IDs */}
        <Route path="/document/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)