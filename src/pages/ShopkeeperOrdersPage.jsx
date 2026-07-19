import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import '../dashboard.css'

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'In-Progress', 'Ready', 'Completed', 'Cancelled']
const PAGE_SIZE = 10

const INITIAL_ORDERS = [
  { id: 'ORD1001', customer: 'Aman Verma', services: 'Wash + Iron, Dry Clean', pickup: 'Jul 17, 09:15 AM', amount: 320, status: 'Pending', time: '09:15 AM' },
  { id: 'ORD1002', customer: 'Priya Singh', services: 'Iron Only', pickup: 'Jul 17, 10:02 AM', amount: 540, status: 'Completed', time: '10:02 AM' },
  { id: 'ORD1003', customer: 'Rohit Mehra', services: 'Wash + Fold', pickup: 'Jul 17, 11:20 AM', amount: 210, status: 'Completed', time: '11:20 AM' },
  { id: 'ORD1004', customer: 'Sneha Kapoor', services: 'Dry Clean', pickup: 'Jul 17, 12:45 PM', amount: 680, status: 'Ready', time: '12:45 PM' },
  { id: 'ORD1005', customer: 'Karan Joshi', services: 'Wash + Iron', pickup: 'Jul 16, 04:30 PM', amount: 430, status: 'Cancelled', time: '01:30 PM' },
  { id: 'ORD1006', customer: 'Neha Gupta', services: 'Wash + Iron, Dry Clean', pickup: 'Jul 16, 06:10 PM', amount: 590, status: 'Accepted', time: '06:10 PM' },
  { id: 'ORD1007', customer: 'Vivek Rao', services: 'Iron Only', pickup: 'Jul 16, 07:00 PM', amount: 180, status: 'Pending', time: '07:00 PM' },
  { id: 'ORD1008', customer: 'Anita Nair', services: 'Wash + Fold', pickup: 'Jul 15, 11:00 AM', amount: 260, status: 'Completed', time: '11:00 AM' },
  { id: 'ORD1009', customer: 'Sahil Khan', services: 'Dry Clean', pickup: 'Jul 15, 01:25 PM', amount: 720, status: 'In-Progress', time: '01:25 PM' },
  { id: 'ORD1010', customer: 'Meera Iyer', services: 'Wash + Iron', pickup: 'Jul 15, 03:40 PM', amount: 350, status: 'Ready', time: '03:40 PM' },
  { id: 'ORD1011', customer: 'Arjun Reddy', services: 'Wash + Fold, Iron Only', pickup: 'Jul 14, 09:50 AM', amount: 470, status: 'Completed', time: '09:50 AM' },
  { id: 'ORD1012', customer: 'Pooja Sharma', services: 'Dry Clean', pickup: 'Jul 14, 12:15 PM', amount: 610, status: 'Cancelled', time: '12:15 PM' },
]

export default function ShopkeeperOrdersPage() {
  // Central local storage integration
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('hexa_laundry_orders')
    return saved ? JSON.parse(saved) : INITIAL_ORDERS
  })
  
  const [tab, setTab] = useState('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    setOrders(updated)
    localStorage.setItem('hexa_laundry_orders', JSON.stringify(updated)) // Sync to localstorage
  }

  const filtered = useMemo(() => {
    let list = orders
    if (tab !== 'All') list = list.filter((o) => o.status === tab)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
    return list
  }, [tab, query, orders])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function changeTab(t) { setTab(t); setPage(1); }
  function changeQuery(v) { setQuery(v); setPage(1); }

  return (
    <DashboardLayout active="orders">
      <div className="page-head">
        <h1>Orders</h1>
        <p className="page-sub">Manage and track all customer orders</p>
      </div>

      <div className="orders-filter-bar">
        <div className="status-tabs">
          {STATUS_TABS.map((t) => (
            <button key={t} className={`status-tab ${tab === t ? 'active' : ''}`} onClick={() => changeTab(t)}>{t}</button>
          ))}
        </div>
        <div className="orders-search">
          <input type="text" placeholder="Search by Order ID or Customer" value={query} onChange={(e) => changeQuery(e.target.value)} />
        </div>
      </div>

      <section className="dash-card orders-section">
        {pageItems.length > 0 ? (
          <>
            <div className="table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Services</th>
                    <th>Pickup</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((o) => (
                    <tr key={o.id}>
                      <td className="cell-id">#{o.id}</td>
                      <td>{o.customer}</td>
                      <td className="cell-services">{o.services}</td>
                      <td className="cell-time">{o.pickup}</td>
                      <td className="cell-amount">₹{o.amount}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            textAlign: 'center',
                            background: 
                              o.status === 'Pending' ? 'rgba(227, 179, 65, 0.15)' :
                              o.status === 'Accepted' ? 'rgba(24, 167, 255, 0.15)' :
                              o.status === 'In-Progress' ? 'rgba(59, 130, 246, 0.15)' :
                              o.status === 'Ready' ? 'rgba(168, 85, 247, 0.15)' :
                              o.status === 'Completed' ? 'rgba(46, 160, 67, 0.15)' : 'rgba(255, 85, 85, 0.15)',
                            color: 
                              o.status === 'Pending' ? '#e3b341' :
                              o.status === 'Accepted' ? '#18A7FF' :
                              o.status === 'In-Progress' ? '#3b82f6' :
                              o.status === 'Ready' ? '#a855f7' :
                              o.status === 'Completed' ? '#56d364' : '#ff5555',
                          }}
                        >
                          {['Pending', 'Accepted', 'In-Progress', 'Ready', 'Completed', 'Cancelled'].map(st => (
                            <option key={st} value={st} style={{ background: '#1c2128', color: '#fff' }}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="view-details-btn" onClick={() => navigate(`/orders/${o.id}`)}>View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="empty-state">No orders found for this filter</p>
        )}
      </section>
    </DashboardLayout>
  )
}