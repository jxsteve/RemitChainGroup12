import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './lib/auth'
import { TransferProvider } from './lib/transfer'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <TransferProvider>
        <App />
      </TransferProvider>
    </AuthProvider>
  </React.StrictMode>,
)
