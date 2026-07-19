import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser, UserProfile } from '@clerk/clerk-react' // Added UserProfile import
import '../profile.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfilePage() {
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const { user } = useUser()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('English')
  const [toast, setToast] = useState({ show: false, text: '' })
  
  // Is state se hum Clerk ka premium user profile modal toggle karenge
  const [isEditing, setIsEditing] = useState(false)

  function getStoredUser() {
    try {
      const stored = localStorage.getItem('hexalaundaryUser')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  const storedUser = getStoredUser()

  // Clerk se real data lo, fallback localStorage se
  const fullName = user?.fullName || storedUser.fullName || 'User'
  const mobile = storedUser.mobile || ''
  const email = user?.primaryEmailAddress?.emailAddress || storedUser.email || storedUser.identifier || ''

  function getInitials(name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text: '' }), 3000)
  }

  function handlePaymentMethods() {
    showToast('Payment methods will be available soon.')
  }

  function handleHelpSupport() {
    showToast('Support: +91 1800-123-4567 | support@hexalaundary.in')
  }

  function handleLogout() {
    localStorage.removeItem('hexalaundaryUser')
    localStorage.removeItem('hexalaundaryLastOrder')
    localStorage.removeItem('hexalaundaryTheme')
    showToast('Logged out successfully.')
    setTimeout(() => {
      signOut(() => navigate('/'))
    }, 1000)
  }

  return (
    <main className="profile-page" style={{ position: 'relative' }}>
      <header className="profile-header">
        <button type="button" className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Profile</h1>
      </header>

      {toast.show && (
        <div className="profile-toast" role="status">{toast.text}</div>
      )}

      <section className="profile-card">
        {/* Agar user ki photo Clerk par hai toh dynamic photo dikhao, nahi toh initials */}
        {user?.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt="Avatar" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginRight: '16px', border: '2px solid #18A7FF' }} 
          />
        ) : (
          <div className="profile-avatar">{getInitials(fullName)}</div>
        )}
        
        <div className="profile-info">
          <h2>{fullName}</h2>
          {mobile ? <p>+91 {mobile}</p> : null}
          <p>{email}</p>
        </div>

        {/* Edit Profile par click karte hi ab Clerk ka complete management modal khulega */}
        <button type="button" className="edit-profile-button" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </section>

      <section className="menu-section">
        <button type="button" className="menu-item" onClick={() => navigate('/address')}>
          <span className="menu-icon">??</span>
          <span className="menu-text">Saved Addresses</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item" onClick={() => navigate('/order-history')}>
          <span className="menu-icon">??</span>
          <span className="menu-text">Order History</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item" onClick={handlePaymentMethods}>
          <span className="menu-icon">??</span>
          <span className="menu-text">Payment Methods</span>
          <span className="menu-arrow">›</span>
        </button>
      </section>

      <section className="settings-section">
        <h3>Settings</h3>

        <div className="setting-item">
          <div className="setting-left">
            <span className="setting-icon">??</span>
            <span className="setting-text">Notifications</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item" onClick={() => setLanguage(language === 'English' ? '?????' : 'English')}>
          <div className="setting-left">
            <span className="setting-icon">??</span>
            <span className="setting-text">Language</span>
          </div>
          <span className="setting-value">{language}</span>
        </div>
      </section>

      <section className="menu-section">
        <button type="button" className="menu-item" onClick={handleHelpSupport}>
          <span className="menu-icon">?</span>
          <span className="menu-text">Help & Support</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item logout" onClick={handleLogout}>
          <span className="menu-icon">??</span>
          <span className="menu-text">Logout</span>
        </button>
      </section>

      {/* --- CLERK PROFILE MODAL WITH INTEGRATED DARK DESIGN --- */}
      {isEditing && (
        <div className="clerk-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="clerk-modal-content" style={{ position: 'relative', background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '24px 16px 16px 16px', maxHeight: '85vh', overflowY: 'auto' }}>
            
            {/* Modal close header handler */}
            <button 
              onClick={() => setIsEditing(false)} 
              style={{ position: 'absolute', top: '12px', right: '12px', background: '#30363d', border: 'none', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ?
            </button>

            {/* Clerk standard control blocks synced with theme styles */}
            <UserProfile 
              appearance={{
                variables: {
                  colorBackground: '#161b22',
                  colorText: '#ffffff',
                  colorPrimary: '#18A7FF',
                  colorInputBackground: '#0d1117',
                  colorInputText: '#ffffff',
                  colorNeutral: '#8b949e',
                },
                elements: {
                  card: { boxShadow: 'none', background: '#161b22' },
                  navbar: { background: '#0d1117', borderRight: '1px solid #30363d' },
                  navbarButton: { color: '#8b949e' },
                  headerTitle: { color: '#ffffff' },
                  headerSubtitle: { color: '#8b949e' },
                  profileSectionTitle: { color: '#ffffff', borderBottom: '1px solid #30363d' },
                  formFieldLabel: { color: '#8b949e' },
                  breadcrumbsItem: { color: '#8b949e' },
                  fileDropAreaInline: { background: '#0d1117', border: '1px dotted #30363d' }
                }
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default ProfilePage
