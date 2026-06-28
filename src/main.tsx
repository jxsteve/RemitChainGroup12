import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import App from './App.tsx'
import { AuthProvider } from './lib/auth'
import { TransferProvider } from './lib/transfer'
import { WalletProvider } from './lib/walletStore'
import { PRIVY_APP_ID, privyConfig } from './lib/privy'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <AuthProvider>
        <WalletProvider>
          <TransferProvider>
            <App />
          </TransferProvider>
        </WalletProvider>
      </AuthProvider>
    </PrivyProvider>
  </React.StrictMode>,
)
