import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { DashboardLayout } from '../components/DashboardLayout.jsx'

export default function ShopkeeperDashboardPage() {
  const { user, isLoaded } = useUser()
  
  // 👈 PURANI LINE KO BADAL KAR YEH RAKH DIYA HAI (Direct firstName check karega)
  const shopName = isLoaded && user ? (user.firstName || 'Shopkeeper') : 'User'

  const [currentDate, setCurrentDate] = useState('')
  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    const today = new Date().toLocaleDateString('en-US', options)
    setCurrentDate(today)
  }, [])

  const recentOrders = [
    { id: '#ORD1001', customer: 'Aman Verma', status: 'In-Progress', statusClass: 'in-progress', amount: '₹320', time: '09:15 AM' },
    { id: '#ORD1002', customer: 'Priya Singh', status: 'Pending', statusClass: 'pending', amount: '₹540', time: '10:02 AM' },
    { id: '#ORD1003', customer: 'Rohit Mehra', status: 'Completed', statusClass: 'completed', amount: '₹210', time: '11:20 AM' },
    { id: '#ORD1004', customer: 'Sneha Kapoor', status: 'Ready', statusClass: 'ready', amount: '₹680', time: '12:45 PM' },
    { id: '#ORD1005', customer: 'Karan Joshi', status: 'Cancelled', statusClass: 'cancelled', amount: '₹430', time: '01:30 PM' }
  ]

  return (
    <DashboardLayout active="dashboard">
      <div className="dashboard-page-content" style={{ padding: '20px', color: 'var(--text-color)' }}>
        
        {/* Welcome Banner Card */}
        <div 
          className="welcome-card" 
          style={{ 
            background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)', 
            borderRadius: '24px', 
            padding: '30px 40px', 
            marginBottom: '30px',
            boxShadow: '0 10px 25px -5px rgba(129, 140, 248, 0.3)'
          }}
        >
          <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Welcome back, {shopName} 👋
          </h1>
          <p style={{ color: '#0f172a', fontSize: '15px', fontWeight: '700', margin: 0, opacity: 0.95 }}>
            {currentDate || 'Monday, 20 July 2026'}
          </p>
        </div>

        {/* Stats Counter Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #334155' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px', color: '#f59e0b', fontSize: '24px' }}>📦</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>12</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Total Orders Today</p>
            </div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #334155' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: '#3b82f6', fontSize: '24px' }}>⏳</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>2</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Pending Orders</p>
            </div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #334155' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', color: '#10b981', fontSize: '24px' }}>✅</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>3</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Completed Orders</p>
            </div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #334155' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '12px', color: '#ec4899', fontSize: '24px' }}>💰</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>₹940</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Today's Earnings</p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div style={{ background: '#1e293b', borderRadius: '20px', padding: '24px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>Recent Orders</h2>
            <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}>View All Orders →</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '12px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Customer Name</th>
                  <th style={{ padding: '12px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '12px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>{order.id}</td>
                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#cbd5e1' }}>{order.customer}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span className={`status-badge ${order.statusClass}`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{order.amount}</td>
                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#94a3b8' }}>{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}