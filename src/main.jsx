import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react' // 1. ClerkProvider import kiya

import App from './App.jsx'
import './index.css'
import './dark-theme.css'
import './ui-polish.css'

// 2. Env file se key fetch ki
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file")
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 3. ClerkProvider ko sabse bahar wrap kiya */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);