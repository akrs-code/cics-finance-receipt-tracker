import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "../context/AuthContext.jsx";
import { BrowserRouter } from 'react-router-dom';
import { ReceiptProvider } from '../context/ReceiptContext.jsx';
import App from './App.jsx';
import { SettingsProvider } from '../context/SettingsContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ReceiptProvider>
            <App />
          </ReceiptProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
