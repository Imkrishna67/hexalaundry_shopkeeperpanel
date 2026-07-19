import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

function SSOCallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--background)',
      color: 'var(--text)'
    }}>
      <AuthenticateWithRedirectCallback />
      <p>Completing login...</p>
    </div>
  )
}

export default SSOCallback
