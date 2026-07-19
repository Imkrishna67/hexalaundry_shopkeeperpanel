import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react' // 👈 Clerk hook import kiya
import { getShopSession, clearShopSession } from '../services/auth.js'
import './../dashboard.css'

function NavIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'dashboard':
      return (<svg {...common}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>)
    case 'orders':
      return (<svg {...common}><path d="M3 7l9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>)
    case 'services':
      return (<svg {...common}><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /><circle cx="12" cy="12" r="3" /></svg>)
    case 'profile':
      return (<svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>)
    case 'analytics':
      return (<svg {...common}><path d="M3 3v18h18" /><path d="M7 16l4-8 4 6 4-10" /></svg>)
    case 'logout':
      return (<svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>)
    default:
      return null
  }
}

function SunIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>)
}

function MoonIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>)
}

export function DashboardLayout({ active, children }) {
  const navigate = useNavigate()
  const { signOut } = useClerk() // 👈 SignOut method nikal liya
  const session = getShopSession()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('hexa_theme')
      if (saved === 'light') return false
      return true
    } catch {
      return true
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
    try {
      localStorage.setItem('hexa_theme', dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }, [dark])

  const links = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { key: 'orders', label: 'Orders', icon: 'orders', to: '/orders' },
    { key: 'analytics', label: 'Analytics', icon: 'analytics', to: '/analytics' },
    { key: 'services', label: 'Services', icon: 'services', to: '/services' },
    { key: 'profile', label: 'Profile', icon: 'profile', to: '/profile' },
  ]

  // 👈 Dono local storage aur Clerk session ko ek sath khatam karne ke liye async function
  async function handleLogout() {
    try {
      clearShopSession() // Custom token cleanup
      await signOut({ redirectUrl: '/login' }) // Clerk authentication cleanup + redirect
    } catch (err) {
      console.error("Logout runtime breakdown:", err)
      navigate('/login') // Fallback redirect agar kuch atke to
    }
  }

  return (
    <div className="dash-shell">
      <aside className={`dash-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="dash-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', width: '100%' }}>
          <button className="dash-menu-btn" onClick={() => setSidebarCollapsed((c) => !c)} aria-label="Hide sidebar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          
          <div 
            className="dash-brand-mark" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0, 
              width: '42px', 
              height: '42px', 
              background: '#ffffff',  
              borderRadius: '12px',
              padding: '6px'
            }} 
            aria-hidden="true"
          >
            <svg viewBox="0 0 64 64" role="img" style={{ width: '100%', height: '100%' }}>
              <path d="M18 20c0-5.5 4.5-10 10-10h8c5.5 0 10 4.5 10 10v24c0 5.5-4.5 10-10 10h-8c-5.5 0-10-4.5-10-10V20Z" fill="#E0F2FE" />
              <path d="M20 22h24M20 31h24M20 40h16" stroke="#18A7FF" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M46 15l2.2-4.2L50.5 15l4.2 2.2-4.2 2.2-2.3 4.3-2.2-4.3-4.2-2.2L46 15Z" fill="#FFD166" />
            </svg>
          </div>

          <span 
            className="dash-brand-text" 
            style={{ 
              whiteSpace: 'nowrap', 
              overflow: 'visible', 
              display: sidebarCollapsed ? 'none' : 'inline-block',
              width: 'auto'
            }}
          >
            Hexa Laundry
          </span>
        </div>

        <nav className="dash-nav">
          {links.map((l) => (
            <NavLink
              key={l.key}
              to={l.to}
              className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
            >
              <NavIcon name={l.icon} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Logout Button */}
        <button className="dash-nav-item dash-logout-item" onClick={handleLogout}>
          <NavIcon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          {sidebarCollapsed && (
            <button 
              className="dash-menu-btn" 
              onClick={() => setSidebarCollapsed(false)} 
              style={{ marginRight: '15px', background: 'none', border: 'none', color: 'currentColor', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Show sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          )}

          <div className="dash-shop-name">{session?.shopName || 'My Shop'}</div>
          
          <button className="dash-bell" aria-label="Notifications" onClick={() => alert('Notifications coming soon')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </button>
          <button className="dash-theme-toggle" onClick={() => setDark((d) => !d)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          
          {/* Topbar Header Logout Button */}
          <button className="dash-logout" onClick={handleLogout}>
            <NavIcon name="logout" />
            <span>Logout</span>
          </button>
        </header>

        <div className="dash-content">{children}</div>
      </div>
    </div>
  )
}