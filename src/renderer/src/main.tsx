import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClerkProvider } from '@clerk/clerk-react'

const publishableKey = window.electron.process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key')
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ClerkProvider publishableKey={publishableKey}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ClerkProvider>
)