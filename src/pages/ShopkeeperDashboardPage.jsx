import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShopSession } from '../services/auth.js'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import '../dashboard.css'

const TODAY = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const FALLBACK_ORDERS = [
  { id: 'ORD1001', customer: 'Aman Verma', status: 'Pending', amount: 320, time: '09:15 AM' },
  { id: 'ORD1002', customer: 'Priya Singh', status: 'Completed', amount: 540, time: '10:02 AM' },
  { id: 'ORD1003', customer: 'Rohit Mehra', status: 'Completed', amount: 210, time: '11:20 AM' },
  { id: 'ORD1004', customer: 'Sneha Kapoor', status: 'Pending', amount: 680, time: '12:45 PM' },
  { id: 'ORD1005', customer: 'Karan Joshi', status: 'Completed', amount: 430, time: '01:30 PM' },
]

function StatCard({ icon, label, value, tone }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    Pending: 'badge-pending',
    Accepted: 'badge-accepted',
    'In-Progress': 'badge-progress',
    Ready: 'badge-ready',
    Completed: 'badge-completed',
    Cancelled: 'badge-cancelled',
  }
  return <span className={`status-badge ${map[status] || 'badge-default'}`}>{status}</span>
}

export default function ShopkeeperDashboardPage() {
  const navigate = useNavigate()
  const session = getShopSession()
  
  const [orders] = useState(() => {
    const saved = localStorage.getItem('hexa_laundry_orders')
    return saved ? JSON.parse(saved) : FALLBACK_ORDERS
  })

  const stats = {
    totalToday: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    earnings: orders.filter(o => o.status === 'Completed').reduce((acc, curr) => acc + curr.amount, 0)
  }

  return (
    <DashboardLayout active="dashboard">
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Welcome back, {session?.shopName || 'Shop'} 👋</h1>
          <p className="welcome-date">{TODAY}</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard tone="primary" icon={<span>📦</span>} label="Total Orders Today" value={stats.totalToday} />
        <StatCard tone="warning" icon={<span>⏳</span>} label="Pending Orders" value={stats.pending} />
        <StatCard tone="success" icon={<span>✅</span>} label="Completed Orders" value={stats.completed} />
        <StatCard tone="revenue" icon={<span>💰</span>} label="Today's Earnings" value={`₹${stats.earnings}`} />
      </div>

      <section className="dash-card recent-orders">
        <div className="dash-card-head">
          <h2>Recent Orders</h2>
          <button className="text-link" onClick={() => navigate('/orders')}>View All Orders →</button>
        </div>

        {orders.length > 0 ? (
          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="cell-id">#{o.id}</td>
                    <td>{o.customer}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="cell-amount">₹{o.amount}</td>
                    <td className="cell-time">{o.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No orders yet.</p>
        )}
      </section>
    </DashboardLayout>
  )
}