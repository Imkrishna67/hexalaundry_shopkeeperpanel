import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // 👈 Axios import kiya data send karne ke liye

export default function ShopWelcomeScreen() {
  const { isLoaded, user } = useUser()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  const shopName = user?.firstName || 'Your Shop'

  // 1. BEJHIYAK BACKEND PAR DATA BHEJNA (Jisse database mein save ho)
  useEffect(() => {
    const saveShopToDatabase = async () => {
      if (isLoaded && user) {
        try {
          await axios.post('http://localhost:5000/api/shops', {
            shopName: shopName,
            email: user.primaryEmailAddress?.emailAddress,
            clerkUserId: user.id
          })
          console.log("Shop successfully saved to MongoDB Atlas!")
        } catch (error) {
          console.error("Error saving shop to database:", error)
        }
      }
    }
    saveShopToDatabase()
  }, [isLoaded, user, shopName])

  // 2. CONSOLE ERROR FIX (Navigate ko setInterval se bahar nikala)
  useEffect(() => {
    if (countdown === 0) {
      navigate('/dashboard')
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, navigate])

  if (!isLoaded) {
    return (
      <div style={{ backgroundColor: '#09090b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #1c1c1f', borderTopColor: '#18A7FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <main style={{ backgroundColor: '#09090b', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      
      <div style={{ position: 'fixed', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(24, 167, 255, 0.08) 0%, rgba(0,0,0,0) 70%)', top: '10%', left: '10%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(165, 180, 252, 0.05) 0%, rgba(0,0,0,0) 70%)', bottom: '10%', right: '10%', zIndex: 0, pointerEvents: 'none' }} />

      <section style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px', width: '100%', textAlign: 'center', animation: 'contentFadeIn 0.6s ease-out' }}>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #1e1b4b 0%, #111218 100%)', 
          border: '1px solid rgba(165, 180, 252, 0.2)', 
          borderRadius: '50%', 
          width: '96px', 
          height: '96px', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'center', 
          marginBottom: '32px', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.05)',
          animation: 'bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
          Registration Complete!
        </h1>
        
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          Welcome aboard! Your shop, <span style={{ color: '#18A7FF', fontWeight: '600' }}>{shopName}</span>, is now successfully registered in the Hexa Laundry network.
        </p>

        <div style={{ backgroundColor: '#0a0a0c', border: '1px solid #1c1c1f', borderRadius: '12px', padding: '24px', width: '100%', boxSizing: 'border-box', marginBottom: '32px', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h3 style={{ color: '#e4e4e7', fontSize: '1rem', fontWeight: '600', margin: '0 0 12px 0' }}>What's next?</h3>
          <ul style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>Setup your services and dynamic pricing packages.</li>
            <li>Monitor incoming customer orders live in your dashboard.</li>
            <li>Track your daily analytics and operations smoothly.</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ backgroundColor: '#18A7FF', color: '#ffffff', fontSize: '16px', fontWeight: '600', padding: '14px 28px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(24, 167, 255, 0.3)', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Go to Dashboard
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <p style={{ color: '#71717a', fontSize: '0.85rem', marginTop: '16px' }}>
          Redirecting automatically in <span style={{ color: '#a5b4fc', fontWeight: '600' }}>{countdown}s</span>...
        </p>

      </section>

      <style>{`
        @keyframes contentFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 0.9; transform: scale(1.1); }
          80% { transform: scale(0.89); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  )
}