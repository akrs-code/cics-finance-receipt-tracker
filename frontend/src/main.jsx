import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "../context/AuthContext.jsx";
import { BrowserRouter } from 'react-router-dom';
import { ReceiptProvider } from '../context/ReceiptContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReceiptProvider>
          <App />
        </ReceiptProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
