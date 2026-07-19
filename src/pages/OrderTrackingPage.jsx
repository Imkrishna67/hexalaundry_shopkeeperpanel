import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../order-tracking.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STATUS_STEPS = [
  { id: 'Order Placed', label: 'Order Placed', icon: '??' },
  { id: 'Picked Up', label: 'Picked Up', icon: '??' },
  { id: 'Washing', label: 'Washing', icon: '??' },
  { id: 'Ready', label: 'Ready', icon: '?' },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: '??' },
  { id: 'Delivered', label: 'Delivered', icon: '??' },
]

const CANCEL_WINDOW_MS = 15 * 60 * 1000

function OrderTrackingPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelMessage, setCancelMessage] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    async function fetchOrder() {
      try {
        const lastOrder = JSON.parse(localStorage.getItem('hexalaundaryLastOrder') || '{}')
        const mongoId = lastOrder.mongoId

        if (mongoId) {
          const response = await fetch(`${apiBaseUrl}/api/orders/detail/${mongoId}`)
          const data = await response.json()
          setOrder(data)
        } else {
          setOrder(lastOrder)
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        const lastOrder = JSON.parse(localStorage.getItem('hexalaundaryLastOrder') || '{}')
        setOrder(lastOrder)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [])

  async function handleCancelOrder() {
    try {
      setIsCancelling(true)
      const lastOrder = JSON.parse(localStorage.getItem('hexalaundaryLastOrder') || '{}')
      const mongoId = lastOrder.mongoId

      if (!mongoId) {
        setCancelMessage('Unable to cancel order. Please try again.')
        return
      }

      const response = await fetch(`${apiBaseUrl}/api/orders/${mongoId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      })

      if (response.ok) {
        setOrder((prev) => ({ ...prev, status: 'Cancelled' }))
        setCancelMessage('Order cancelled successfully.')
        setShowCancelConfirm(false)
        // Clear last order from localStorage
        localStorage.removeItem('hexalaundaryLastOrder')
        setTimeout(() => navigate('/order-history'), 2000)
      } else {
        setCancelMessage('Failed to cancel order. Please try again.')
      }
    } catch (err) {
      setCancelMessage('Unable to connect. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <main className="tracking-page">
        <header className="tracking-header"><h1>Track Order</h1></header>
        <div className="empty-state"><p>Loading...</p></div>
      </main>
    )
  }

  if (!order || !order._id) {
    return (
      <main className="tracking-page">
        <header className="tracking-header">
          <button className="back-button" type="button" onClick={() => navigate('/home')} aria-label="Go back">
            <BackIcon />
          </button>
          <h1>Track Order</h1>
        </header>
        <div className="empty-state">
          <p>No active order to track.</p>
          <button className="back-button" type="button" onClick={() => navigate('/services')}>
            Book a Service
          </button>
        </div>
      </main>
    )
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((step) => step.id === order.status)
  const currentStep = STATUS_STEPS[currentStatusIndex] || STATUS_STEPS[0]
  const isCancelled = order.status === 'Cancelled'

  const placedAt = order?.createdAt ? new Date(order.createdAt).getTime() : null
  const cancelDeadline = placedAt ? placedAt + CANCEL_WINDOW_MS : null
  const isWithinCancelWindow = cancelDeadline ? now <= cancelDeadline : false
  const isCancellable = order.status === 'Order Placed' && isWithinCancelWindow

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <button className="back-button" type="button" onClick={() => navigate('/home')} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Track Order</h1>
        <div className="order-id-badge">#{order._id.slice(-8).toUpperCase()}</div>
      </header>

      <section className="status-card" aria-labelledby="current-status-label">
        <div className="current-status-icon">{isCancelled ? '?' : currentStep.icon}</div>
        <h2 id="current-status-label">{isCancelled ? 'Order Cancelled' : currentStep.label}</h2>
        {!isCancelled && (
          <p className="estimated-delivery">
            {order.status === 'Delivered' ? 'Delivered on: ' : 'Estimated Delivery: '}
            <strong>{formatDate(order.deliveryDate)}</strong>
          </p>
        )}
      </section>

      {!isCancelled && (
        <section className="timeline-card" aria-label="Order progress">
          <div className="timeline-track">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex

              return (
                <div
                  className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  key={step.id}
                >
                  <div
                    className={[
                      'timeline-dot',
                      isCompleted ? 'completed' : '',
                      isCurrent ? 'current' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {isCompleted && !isCurrent ? (
                      <span className="check-icon">?</span>
                    ) : (
                      <span className="step-icon">{step.icon}</span>
                    )}
                  </div>
                  <span className="timeline-label">{step.label}</span>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`timeline-line ${index < currentStatusIndex ? 'filled' : ''}`} />
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="details-card">
        <button
          type="button"
          className="collapsible-trigger"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span>Order Details</span>
          <svg
            className={`chevron ${expanded ? 'open' : ''}`}
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <div className="collapsible-content">
            {order.services && order.services.length > 0 && (
              <div className="details-section">
                <h4>Services</h4>
                {order.services.map((service, index) => (
                  <div className="detail-row" key={index}>
                    <span><strong>{service.name}</strong> × {service.quantity}</span>
                    <span>?{service.price * service.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="details-section">
              <h4>Pickup</h4>
              <div className="detail-row">
                <span>Date</span>
                <strong>{formatDate(order.pickupDate)}</strong>
              </div>
              <div className="detail-row">
                <span>Slot</span>
                <strong>{order.pickupTime}</strong>
              </div>
            </div>

            <div className="details-section">
              <h4>Delivery</h4>
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
              <div className="details-section">
                <h4>Address</h4>
                <p>{order.address}</p>
              </div>
            )}

            <div className="details-total">
              <span>Total Amount</span>
              <strong>?{order.total}</strong>
            </div>
          </div>
        )}
      </section>

      {cancelMessage ? (
        <p className={`cancel-message ${cancelMessage.includes('successfully') ? 'success' : 'error'}`}>
          {cancelMessage}
        </p>
      ) : null}

      {showCancelConfirm && (
        <div className="cancel-confirm-box">
          <p>Are you sure you want to cancel this order?</p>
          <div className="cancel-confirm-actions">
            <button
              type="button"
              className="confirm-cancel-btn"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
            <button
              type="button"
              className="confirm-keep-btn"
              onClick={() => setShowCancelConfirm(false)}
            >
              No, Keep
            </button>
          </div>
        </div>
      )}

      <div className="tracking-actions">
        <button type="button" className="home-button" onClick={() => navigate('/home')}>
          Home
        </button>
        {isCancellable && !showCancelConfirm && (
          <button
            type="button"
            className="cancel-order-btn"
            onClick={() => setShowCancelConfirm(true)}
          >
            Cancel Order
          </button>
        )}
      </div>

      {order.status === 'Order Placed' && !isWithinCancelWindow && (
        <p className="cancel-window-note">
          Orders can only be cancelled within 15 minutes of being placed.
        </p>
      )}
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

export default OrderTrackingPage
