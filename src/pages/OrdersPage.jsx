import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../home.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: 20, height: 20 }}>
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function readCartItems() {
  try {
    const storedCart = localStorage.getItem('hexalaundaryCart')
    return storedCart ? JSON.parse(storedCart) : {}
  } catch {
    return {}
  }
}

function readSchedule() {
  try {
    const storedSchedule = localStorage.getItem('hexalaundarySchedule')
    return storedSchedule ? JSON.parse(storedSchedule) : null
  } catch {
    return null
  }
}

function readAddresses() {
  try {
    const storedAddresses = localStorage.getItem('hexalaundaryAddresses')
    return storedAddresses ? JSON.parse(storedAddresses) : []
  } catch {
    return []
  }
}

function readSelectedAddressId() {
  return localStorage.getItem('hexalaundarySelectedAddressId') || ''
}

function readOrderTotals() {
  try {
    const storedTotals = localStorage.getItem('hexalaundaryOrderTotals')
    return storedTotals ? JSON.parse(storedTotals) : { subtotal: 0, deliveryCharge: 0, discount: 0, total: 0 }
  } catch {
    return { subtotal: 0, deliveryCharge: 0, discount: 0, total: 0 }
  }
}

function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = new Date(`${dateValue}T00:00:00`)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function OrdersPage() {
  const navigate = useNavigate()
  const cartItems = readCartItems()
  const schedule = readSchedule()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [services, setServices] = useState([])

  // Fetch services from MongoDB
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/services`)
        const data = await response.json()
        setServices(data)
      } catch (err) {
        console.error('Failed to fetch services:', err)
      }
    }
    fetchServices()
  }, [])

  const selectedServices = useMemo(
    () =>
      services
        .filter((service) => (cartItems[service._id] || 0) > 0)
        .map((service) => ({
          ...service,
          quantity: cartItems[service._id],
          lineTotal: service.price * cartItems[service._id],
        })),
    [cartItems, services],
  )

  const totals = readOrderTotals()
  const addresses = readAddresses()
  const selectedAddressId = readSelectedAddressId()
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)

  const formattedPickupDate = schedule?.pickupDate ? formatDate(schedule.pickupDate) : ''
  const formattedDeliveryDate = schedule?.deliveryDate ? formatDate(schedule.deliveryDate) : ''

  function handlePlaceOrder() {
    if (selectedServices.length === 0 || !selectedAddress || !schedule) return

    const orderCount = localStorage.getItem('hexalaundaryOrderCount') || '0'
    const nextOrderCount = parseInt(orderCount, 10) + 1
    localStorage.setItem('hexalaundaryOrderCount', String(nextOrderCount))

    const order = {
      id: `HL-${String(1000 + nextOrderCount).slice(1)}`,
      services: selectedServices.map((s) => ({
        id: s._id,
        name: s.name,
        price: s.price,
        quantity: s.quantity,
        lineTotal: s.lineTotal,
      })),
      schedule,
      address: selectedAddress,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      subtotal: totals.subtotal,
      deliveryCharge: totals.deliveryCharge,
      discount: totals.discount,
      total: totals.total,
      promoCode: totals.promoCode || '',
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem('hexalaundaryLastOrder', JSON.stringify(order))
    localStorage.setItem('hexalaundaryCart', '{}')
    localStorage.setItem('hexalaundaryPickupChecked', 'true')
    navigate('/order-confirmation')
  }

  return (
    <main className="order-review-page">
      <header className="order-header">
        <button className="back-button" type="button" onClick={() => navigate('/address')} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Order Review</h1>
      </header>

      <section className="review-card">
        <h2>Services</h2>
        <div className="review-services-list">
          {selectedServices.length === 0 ? (
            <p style={{ color: '#aaa' }}>No services selected.</p>
          ) : (
            selectedServices.map((service) => (
              <div key={service._id} className="review-service-item">
                <span className="review-service-name">{service.name}</span>
                <span className="review-service-qty">x{service.quantity}</span>
                <span className="review-service-price">₹{service.lineTotal}</span>
              </div>
            ))
          )}
        </div>
        <button className="edit-link" type="button" onClick={() => navigate('/cart')}>Edit</button>
      </section>

      <section className="review-card">
        <h2>Scheduling</h2>
        <div className="review-schedule-info">
          <p>
            <strong>Pickup:</strong>{' '}
            {formattedPickupDate} | {schedule?.pickupSlot?.split(' - ')[0] || 'Select slot'}
          </p>
          <p>
            <strong>Delivery:</strong>{' '}
            {formattedDeliveryDate} | {schedule?.deliverySlot?.split(' - ')[0] || 'Select slot'}
          </p>
        </div>
        <button className="edit-link" type="button" onClick={() => navigate('/schedule')}>Edit</button>
      </section>

      <section className="review-card">
        <h2>Address</h2>
        {selectedAddress ? (
          <div className="review-address-info">
            <p><strong>{selectedAddress.houseNo}, {selectedAddress.street}</strong></p>
            <p>
              {selectedAddress.city} - {selectedAddress.pincode}
              {selectedAddress.landmark && ` | ${selectedAddress.landmark}`}
            </p>
          </div>
        ) : (
          <p className="review-no-address">No address selected</p>
        )}
        <button className="edit-link" type="button" onClick={() => navigate('/address')}>Edit</button>
      </section>

      <section className="review-card">
        <h2>Pricing</h2>
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal</span>
            <strong>₹{totals.subtotal}</strong>
          </div>
          <div className="price-row">
            <span>Delivery</span>
            <strong>{totals.deliveryCharge === 0 ? 'Free' : `₹${totals.deliveryCharge}`}</strong>
          </div>
          {totals.discount > 0 && (
            <div className="price-row discount">
              <span>Discount</span>
              <strong>-₹{totals.discount}</strong>
            </div>
          )}
          <div className="price-row total">
            <span>Total</span>
            <strong>₹{totals.total}</strong>
          </div>
        </div>
      </section>

      <section className="review-card">
        <h2>Payment</h2>
        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <span className="payment-text">Cash on Delivery</span>
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
            />
            <span className="payment-text">Online Payment</span>
          </label>
        </div>
      </section>

      {schedule?.instructions && (
        <section className="review-card">
          <h2>Notes</h2>
          <p className="review-instructions">{schedule.instructions}</p>
        </section>
      )}

      <button
        className="place-order-button"
        type="button"
        onClick={handlePlaceOrder}
        disabled={selectedServices.length === 0 || !selectedAddress || !schedule}
      >
        Place Order
      </button>
    </main>
  )
}

export default OrdersPage