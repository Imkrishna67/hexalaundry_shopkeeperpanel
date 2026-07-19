import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import '../dashboard.css'

// Mock lookup — replace with API calls when backend is ready.
const MOCK_ORDERS = {
  ORD1001: { id: 'ORD1001', date: 'Jul 17, 2026', customer: 'Aman Verma', phone: '9876543210', address: '12, Green Park, Delhi - 110016', pickup: 'Jul 17, 09:15 AM', delivery: 'Jul 18, 06:00 PM', status: 'Pending', promo: null, items: [{ service: 'Wash + Iron', qty: 3, price: 80 }, { service: 'Dry Clean', qty: 2, price: 120 }] },
  ORD1004: { id: 'ORD1004', date: 'Jul 17, 2026', customer: 'Sneha Kapoor', phone: '9123456780', address: '45, MG Road, Bengaluru - 560001', pickup: 'Jul 17, 12:45 PM', delivery: 'Jul 18, 12:00 PM', status: 'Ready', promo: { code: 'SAVE10', discount: 68 }, items: [{ service: 'Dry Clean', qty: 4, price: 170 }] },
}

const STATUS_FLOW = {
  Pending: { next: 'Accepted', label: 'Accept Order', cls: 'accept' },
  Accepted: { next: 'In-Progress', label: 'Start Processing', cls: 'process' },
  'In-Progress': { next: 'Ready', label: 'Mark Ready', cls: 'ready' },
  Ready: { next: 'Delivered', label: 'Mark Delivered', cls: 'deliver' },
}

const STATUS_BADGE = {
  Pending: 'badge-pending',
  Accepted: 'badge-accepted',
  'In-Progress': 'badge-progress',
  Ready: 'badge-ready',
  Delivered: 'badge-completed',
  Cancelled: 'badge-cancelled',
}

function BigBadge({ status }) {
  return <span className={`detail-status-badge ${STATUS_BADGE[status] || 'badge-default'}`}>{status}</span>
}

export default function ShopkeeperOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(MOCK_ORDERS[id] || null)
  const [confirm, setConfirm] = useState(null) // { type: 'advance'|'cancel', nextStatus }

  const calc = useMemo(() => {
    if (!order) return null
    const subtotal = order.items.reduce((s, it) => s + it.qty * it.price, 0)
    const discount = order.promo?.discount || 0
    const total = subtotal - discount
    return { subtotal, discount, total }
  }, [order])

  if (!order) {
    return (
      <DashboardLayout active="orders">
        <button className="back-btn" onClick={() => navigate('/orders')}>← Back to Orders</button>
        <div className="dash-card"><p className="empty-state">Order "{id}" not found.</p></div>
      </DashboardLayout>
    )
  }

  const flow = STATUS_FLOW[order.status]

  function applyStatus(newStatus) {
    setOrder((o) => ({ ...o, status: newStatus }))
    setConfirm(null)
  }

  return (
    <DashboardLayout active="orders">
      <button className="back-btn" onClick={() => navigate('/orders')}>← Back to Orders</button>

      <div className="detail-top">
        <h1>Order #{order.id}</h1>
        <BigBadge status={order.status} />
      </div>

      <div className="detail-grid">
        {/* Section 1: Info */}
        <section className="dash-card detail-info">
          <h2>Customer & Order Info</h2>
          <div className="info-row"><span>Order Date</span><strong>{order.date}</strong></div>
          <div className="info-row"><span>Customer Name</span><strong>{order.customer}</strong></div>
          <div className="info-row">
            <span>Phone</span>
            <strong className="phone-row">
              {order.phone}
              <a className="call-icon" href={`tel:${order.phone}`} aria-label="Call customer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
              </a>
            </strong>
          </div>
          <div className="info-row"><span>Address</span><strong>{order.address}</strong></div>
          <div className="info-row"><span>Pickup</span><strong>{order.pickup}</strong></div>
          <div className="info-row"><span>Delivery</span><strong>{order.delivery}</strong></div>
        </section>

        {/* Section 2: Services + Status */}
        <div className="detail-right">
          <section className="dash-card detail-services">
            <h2>Services Breakdown</h2>
            <div className="table-wrap">
              <table className="orders-table detail-services-table">
                <thead>
                  <tr><th>Service</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  {order.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.service}</td>
                      <td>{it.qty}</td>
                      <td>₹{it.price}</td>
                      <td className="cell-amount">₹{it.qty * it.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="price-summary">
              <div className="price-row"><span>Subtotal</span><strong>₹{calc.subtotal}</strong></div>
              {order.promo && (
                <div className="price-row discount">
                  <span>Promo ({order.promo.code})</span>
                  <strong>- ₹{calc.discount}</strong>
                </div>
              )}
              <div className="price-row total"><span>Total Amount</span><strong>₹{calc.total}</strong></div>
            </div>
          </section>

          <section className="dash-card detail-status">
            <h2>Status Management</h2>
            {flow ? (
              <button className={`status-action-btn ${flow.cls}`} onClick={() => setConfirm({ type: 'advance', nextStatus: flow.next })}>
                {flow.label}
              </button>
            ) : (
              <p className="status-final">This order is {order.status}.</p>
            )}
            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
              <button className="status-action-btn cancel" onClick={() => setConfirm({ type: 'cancel', nextStatus: 'Cancelled' })}>
                Cancel Order
              </button>
            )}
          </section>
        </div>
      </div>

      {confirm && (
        <div className="modal-scrim" onClick={() => setConfirm(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure?</h3>
            <p>
              {confirm.type === 'cancel'
                ? `Do you want to cancel order #${order.id}?`
                : `Are you sure you want to mark this order as ${confirm.nextStatus}?`}
            </p>
            <div className="confirm-actions">
              <button className="confirm-no" onClick={() => setConfirm(null)}>No, keep it</button>
              <button
                className={confirm.type === 'cancel' ? 'confirm-yes danger' : 'confirm-yes'}
                onClick={() => applyStatus(confirm.nextStatus)}
              >
                Yes, confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
