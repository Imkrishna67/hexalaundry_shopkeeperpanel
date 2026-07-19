import { SignUp } from '@clerk/clerk-react'
import '../login.css'

export default function ShopkeeperRegisterPage() {
  return (
    <main className="login-page" style={{ backgroundColor: '#09090b', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px', boxSizing: 'border-box' }}>
      {/* Background Orbs */}
      <div className="login-bg-orb login-bg-orb-one" />
      <div className="login-bg-orb login-bg-orb-two" />

      {/* Main Wrapper Element */}
      <section className="login-shell" aria-labelledby="register-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {/* Top Headings with Centering & Alignment matching the Login Page exactly */}
        <div className="brand-section" style={{ marginBottom: '28px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 className="brand-heading" id="register-title" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a5b4fc', whiteSpace: 'nowrap', margin: '0' }}>
            Welcome to Hexa Laundry
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '8px', marginBottom: '4px' }}>
            Start your Hexa Laundry journey
          </p>
          <p style={{ color: '#18A7FF', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
            Shopkeeper Panel
          </p>
        </div>

        {/* Clerk Jet Black UI Signup Container */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '430px'
        }}>
          <SignUp 
            signInUrl="/login" 
            forceRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#18A7FF',
                colorBackground: '#0a0a0c', // Pure Pitch Dark Card Surface
                colorText: '#ffffff',
                colorTextSecondary: '#94a3b8',
                colorInputBackground: '#121214', // Solid dark background for input fields
                colorInputText: '#ffffff',
                colorBorder: '#1c1c1f',
              },
              elements: {
                rootBox: "clerk-register-root",
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
                  backgroundColor: '#0a0a0c' // Kills any white/light gray background remnants
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
                  fontSize: "15px",
                  fontWeight: "600",
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
                formFieldHintText: {
                  color: '#71717a'
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