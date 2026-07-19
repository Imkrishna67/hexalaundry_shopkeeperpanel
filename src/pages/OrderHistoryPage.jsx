import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../order-history.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TABS = [
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

const ONGOING_STATUSES = ['Order Placed', 'Picked Up', 'Washing', 'Ready', 'Out for Delivery']
const COMPLETED_STATUSES = ['Delivered']
const CANCELLED_STATUSES = ['Cancelled']

function getTabFromStatus(status) {
  if (COMPLETED_STATUSES.includes(status)) return 'completed'
  if (CANCELLED_STATUSES.includes(status)) return 'cancelled'
  return 'ongoing'
}

function OrderHistoryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('ongoing')
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const user = JSON.parse(localStorage.getItem('hexalaundaryUser') || '{}')
        if (!user.email) return

        const response = await fetch(`${apiBaseUrl}/api/orders/${encodeURIComponent(user.email)}`)
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (id) {
    return <OrderHistoryDetailView orderId={id} onBack={() => navigate('/order-history')} />
  }

  const filteredOrders = orders.filter((order) => getTabFromStatus(order.status) === activeTab)

  return (
    <main className="history-page">
      <header className="history-header">
        <h1>My Orders</h1>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="empty-state"><p>Loading orders...</p></div>
      ) : (
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No {activeTab} orders yet.</p>
              <button className="back-button" type="button" onClick={() => navigate('/services')}>
                Book a Service
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const tab = getTabFromStatus(order.status)
              const badgeMap = {
                ongoing: { text: order.status, className: 'badge-ongoing' },
                completed: { text: 'Completed', className: 'badge-completed' },
                cancelled: { text: 'Cancelled', className: 'badge-cancelled' },
              }
              const badge = badgeMap[tab]
              const serviceSummary = order.services
                .map((s) => `${s.name} ×${s.quantity}`)
                .join(', ')

              return (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => navigate(`/order-history/${order._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/order-history/${order._id}`)
                    }
                  }}
                >
                  <div className="order-card-top">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`status-badge ${badge.className}`}>{badge.text}</span>
                  </div>

                  <p className="order-date">{formatDate(order.createdAt)}</p>
                  <p className="order-services">{serviceSummary}</p>

                  <div className="order-card-bottom">
                    <span className="order-amount">?{order.total}</span>
                    {tab === 'completed' && (
                      <button
                        className="reorder-button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate('/services')
                        }}
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </main>
  )
}

function OrderHistoryDetailView({ orderId, onBack }) {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [helpCopied, setHelpCopied] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/orders/detail/${orderId}`)
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error('Failed to fetch order:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return <main className="history-page"><div className="empty-state"><p>Loading...</p></div></main>
  }

  if (!order) {
    return (
      <main className="history-page">
        <header className="history-header">
          <button type="button" className="back-button" onClick={onBack}><BackIcon /></button>
          <h1>Order Not Found</h1>
        </header>
      </main>
    )
  }

  const tab = getTabFromStatus(order.status)
  const badgeMap = {
    ongoing: { text: order.status, className: 'badge-ongoing' },
    completed: { text: 'Completed', className: 'badge-completed' },
    cancelled: { text: 'Cancelled', className: 'badge-cancelled' },
  }
  const badge = badgeMap[tab]

  function handleHelp() {
    navigator.clipboard.writeText('Support: +91 1800-123-4567 | support@hexalaundary.in')
    setHelpCopied(true)
    setTimeout(() => setHelpCopied(false), 2000)
  }

  return (
    <main className="history-page">
      <header className="history-header">
        <button type="button" className="back-button" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Order Details</h1>
      </header>

      <div className="detail-card">
        <div className="detail-top-row">
          <span className="detail-order-id">#{order._id.slice(-8).toUpperCase()}</span>
          <span className={`status-badge ${badge.className}`}>{badge.text}</span>
        </div>

        <p className="detail-date">{formatDate(order.createdAt)}</p>

        <div className="detail-section">
          <h3>Services</h3>
          {order.services.map((service, index) => (
            <div className="detail-row" key={index}>
              <span><strong>{service.name}</strong> × {service.quantity}</span>
              <span>?{service.price * service.quantity}</span>
            </div>
          ))}
        </div>

        <div className="detail-section">
          <h3>Pickup</h3>
          <div className="detail-row">
            <span>Date</span>
            <strong>{formatDate(order.pickupDate)}</strong>
          </div>
          <div className="detail-row">
            <span>Slot</span>
            <strong>{order.pickupTime}</strong>
          </div>
        </div>

        <div className="detail-section">
          <h3>Delivery</h3>
          <div className="detail-row">
            <span>Date</span>
            <strong>{formatDate(order.deliveryDate)}</strong>
          </div>
          <div className="detail-row">
            <span>Slot</span>
            <strong>{order.deliveryTime}</strong>
          </div>
        </div>

        {order.address && (
          <div className="detail-section">
            <h3>Delivery Address</h3>
            <p className="detail-address">{order.address}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Price Breakdown</h3>
          <div className="detail-row">
            <span>Subtotal</span>
            <span>?{order.subtotal}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="detail-row">
              <span>Discount</span>
              <span className="discount-value">- ?{order.discount}</span>
            </div>
          )}
          <div className="detail-row">
            <span>Delivery Fee</span>
            <span>?{order.deliveryCharge}</span>
          </div>
          <div className="detail-total-row">
            <span>Total</span>
            <strong>?{order.total}</strong>
          </div>
        </div>

        <div className="detail-section">
          <h3>Payment</h3>
          <div className="detail-row">
            <span>Method</span>
            <strong>{order.paymentMethod || 'Cash on Delivery'}</strong>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        {tab === 'ongoing' && (
          <button type="button" className="primary-button" onClick={() => navigate('/track-order')}>
            Track Order
          </button>
        )}
        {tab === 'completed' && (
          <button type="button" className="primary-button" onClick={() => navigate('/services')}>
            Reorder
          </button>
        )}
        <button type="button" className="help-button" onClick={handleHelp}>
          {helpCopied ? 'Copied!' : 'Need Help?'}
        </button>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to Orders
        </button>
      </div>
    </main>
  )
}

function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = new Date(dateValue)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default OrderHistoryPage
