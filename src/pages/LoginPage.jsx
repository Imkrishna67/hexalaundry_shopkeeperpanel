import { SignIn, useAuth } from '@clerk/clerk-react'
import '../login.css'

export default function LoginPage() {
  const { isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff', backgroundColor: '#09090b' }}>
        <p>Loading Authentication...</p>
      </div>
    )
  }

  return (
    <main className="login-page" style={{ backgroundColor: '#09090b', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      {/* Background Orbs */}
      <div className="login-bg-orb login-bg-orb-one" />
      <div className="login-bg-orb login-bg-orb-two" />

      {/* Main Container - Widened wrapper so text never wraps */}
      <section className="login-shell" aria-labelledby="login-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {/* Full-width text panel ensuring "Welcome to Hexa Laundry" stays on 1 line */}
        <div className="brand-section" style={{ marginBottom: '28px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 className="brand-heading" id="login-title" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a5b4fc', whiteSpace: 'nowrap', margin: '0' }}>
            Welcome to Hexa Laundry
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '8px', marginBottom: '4px' }}>
            Your laundry, managed with ease
          </p>
          <p style={{ color: '#18A7FF', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
            Shopkeeper Panel
          </p>
        </div>

        {/* Clerk Dark UI Card Container locked back at exact 430px limit */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '430px'
        }}>
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/register"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#18A7FF',
                colorBackground: '#0a0a0c', 
                colorText: '#ffffff',
                colorTextSecondary: '#94a3b8',
                colorInputBackground: '#121214', 
                colorInputText: '#ffffff',
                colorBorder: '#1c1c1f',
              },
              elements: {
                headerTitle: { 
                  color: '#ffffff', 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }, 
                headerSubtitle: { 
                  color: '#94a3b8',
                  textAlign: 'center'
                },
                card: {
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.95)',
                  border: '1px solid #1c1c1f',
                  borderRadius: '16px',
                  width: '100%',
                  padding: '40px 32px',
                  backgroundColor: '#0a0a0c'
                },
                socialButtonsBlockButton: {
                  backgroundColor: '#121214',
                  border: '1px solid #1c1c1f',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1c1c1f',
                    borderColor: '#27272a'
                  }
                },
                socialButtonsBlockButtonText: {
                  color: '#ffffff',
                  fontWeight: '500'
                },
                formButtonPrimary: {
                  backgroundColor: '#18A7FF',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1596e6'
                  }
                },
                formFieldInput: {
                  backgroundColor: '#121214',
                  border: '1px solid #1c1c1f',
                  color: '#ffffff',
                  '&:focus': {
                    borderColor: '#18A7FF'
                  }
                },
                formFieldLabel: {
                  color: '#e4e4e7'
                },
                footerActionText: {
                  color: '#94a3b8'
                },
                footerActionLink: {
                  color: '#18A7FF',
                  '&:hover': {
                    color: '#1596e6'
                  }
                },
                dividerText: {
                  color: '#71717a'
                },
                dividerLine: {
                  backgroundColor: '#1c1c1f'
                },
                identityPreviewText: {
                  color: '#ffffff'
                },
                identityPreviewEditButtonIcon: {
                  color: '#18A7FF'
                }
              }
            }}
          />
        </div>
      </section>
    </main>
  )
}