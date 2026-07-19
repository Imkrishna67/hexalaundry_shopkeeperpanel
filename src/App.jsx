import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react' 
import ShapeGrid from './components/ShapeGrid.jsx'
import ShopkeeperRegisterPage from './pages/ShopkeeperRegisterPage.jsx'
import ShopkeeperLoginPage from './pages/LoginPage.jsx'
import ShopkeeperDashboardPage from './pages/ShopkeeperDashboardPage.jsx'
import ShopkeeperOrdersPage from './pages/ShopkeeperOrdersPage.jsx'
import ShopkeeperOrderDetailPage from './pages/ShopkeeperOrderDetailPage.jsx'
import ShopkeeperServicesPage from './pages/ShopkeeperServicesPage.jsx'
import ShopkeeperProfilePage from './pages/ShopkeeperProfilePage.jsx'
import ShopkeeperAnalyticsPage from './pages/ShopkeeperAnalyticsPage.jsx'
import './index.css'

function App() {
  const location = useLocation()
  const isAuthRoute = ['/', '/register', '/login'].includes(location.pathname)

  return (
    <>
      {isAuthRoute && (
        // zIndex: -1 kiya hai taaki grid form ke bilkul PEECHE chala jaye aur transparent screen na banaye
        <div 
          className="shapegrid-background" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: -1, 
            pointerEvents: 'none' 
          }}
        >
          <ShapeGrid
            speed={0.5}
            squareSize={40}
            direction="diagonal"
            borderColor="#2F293A"
            hoverFillColor="#222"
            shape="square"
            hoverTrailAmount={0}
          />
        </div>
      )}
      
      {/* Container zIndex: 1 ke sath foreground me form ko visible rakhega */}
      <div className="app-content" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/register" element={
            <>
              <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
              <SignedOut><ShopkeeperRegisterPage /></SignedOut>
            </>
          } />

          <Route path="/login" element={
            <>
              <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
              <SignedOut><ShopkeeperLoginPage /></SignedOut>
            </>
          } />

          {/* Protected Area Layouts */}
          <Route path="/dashboard" element={<SignedIn><ShopkeeperDashboardPage /></SignedIn>} />
          <Route path="/orders" element={<SignedIn><ShopkeeperOrdersPage /></SignedIn>} />
          <Route path="/orders/:id" element={<SignedIn><ShopkeeperOrderDetailPage /></SignedIn>} />
          <Route path="/services" element={<SignedIn><ShopkeeperServicesPage /></SignedIn>} />
          <Route path="/profile" element={<SignedIn><ShopkeeperProfilePage /></SignedIn>} />
          <Route path="/analytics" element={<SignedIn><ShopkeeperAnalyticsPage /></SignedIn>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App