import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../cart.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

const availablePromoCodes = [
  { code: 'QUICK20', description: '20% off on your order', discount: 0.20, type: 'percentage' },
  { code: 'WASH50', description: '?50 off on orders above ?500', discount: 50, type: 'fixed', minOrder: 500 },
  { code: 'FIRST30', description: '30% off for first time users', discount: 0.30, type: 'percentage' },
]

function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(readCartItems)
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoMessage, setPromoMessage] = useState('')

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/services`)
        const data = await response.json()
        setServices(data)
      } catch (err) {
        console.error('Failed to fetch services:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchServices()
  }, [])

  const selectedServices = useMemo(
    () => {
      if (services.length === 0) return []
      return services
        .filter((service) => (cartItems[service._id] || 0) > 0)
        .map((service) => ({
          ...service,
          quantity: cartItems[service._id],
          lineTotal: service.price * cartItems[service._id],
        }))
    },
    [cartItems, services],
  )

  const subtotal = selectedServices.reduce((total, service) => total + service.lineTotal, 0)

  const discount = useMemo(() => {
    if (!appliedPromo) return 0
    if (appliedPromo.type === 'percentage') return Math.round(subtotal * appliedPromo.discount)
    if (appliedPromo.type === 'fixed') return subtotal >= (appliedPromo.minOrder || 0) ? appliedPromo.discount : 0
    return 0
  }, [appliedPromo, subtotal])

  const deliveryCharge = subtotal > 0 && subtotal - discount >= 500 ? 0 : 40
  const total = Math.max(0, subtotal + deliveryCharge - discount)

  useEffect(() => {
    localStorage.setItem('hexalaundaryCart', JSON.stringify(cartItems))
    localStorage.setItem(
      'hexalaundaryOrderTotals',
      JSON.stringify({
        subtotal,
        deliveryCharge,
        discount,
        total,
        promoCode: appliedPromo ? appliedPromo.code : '',
      }),
    )
  }, [cartItems, subtotal, deliveryCharge, discount, total, appliedPromo])

  function removeItem(serviceId) {
    setCartItems((currentCart) => {
      const nextCart = { ...currentCart }
      delete nextCart[serviceId]
      return nextCart
    })
  }

  function handleApplyPromo(event) {
    event.preventDefault()
    const normalizedCode = promoCode.trim().toUpperCase()

    if (!normalizedCode) {
      setPromoMessage('Please enter a promo code.')
      setAppliedPromo(null)
      return
    }

    const found = availablePromoCodes.find((p) => p.code === normalizedCode)

    if (!found) {
      setAppliedPromo(null)
      setPromoMessage('Invalid promo code. Try QUICK20, WASH50, or FIRST30.')
      return
    }

    if (found.type === 'fixed' && subtotal < (found.minOrder || 0)) {
      setAppliedPromo(null)
      setPromoMessage(`Minimum order ?${found.minOrder} required for ${found.code}.`)
      return
    }

    setAppliedPromo(found)
    setPromoMessage('Promo code applied successfully! ??')
  }

  function handlePromoTagClick(code) {
    setPromoCode(code)
    setPromoMessage('')
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="cart-page">
        <header className="cart-header">
          <h1>Your Cart</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
          <p>Loading cart...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <button className="add-more-link" type="button" onClick={() => navigate('/services')}>
          Add More
        </button>
      </header>

      {!isLoading && selectedServices.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-icon" aria-hidden="true">
            <BagIcon />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add laundry services from the service selection page to continue.</p>
          <button className="proceed-button" type="button" onClick={() => navigate('/services')}>
            Browse Services
          </button>
        </section>
      ) : (
        <>
          <section className="cart-list" aria-label="Selected services">
            {selectedServices.map((service) => (
              <article className="cart-item" key={service._id}>
                <div className="cart-item-icon" aria-hidden="true">
                  <BagIcon />
                </div>
                <div>
                  <h2>{service.name}</h2>
                  <p>?{service.price} × {service.quantity}</p>
                </div>
                <div className="item-meta">
                  <span className="item-price">?{service.lineTotal}</span>
                  <span className="item-quantity">Qty {service.quantity}</span>
                  <button
                    className="remove-button"
                    type="button"
                    aria-label={`Remove ${service.name}`}
                    onClick={() => removeItem(service._id)}
                  >
                    <RemoveIcon />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="cart-summary-card" aria-label="Price breakdown">
            <h2>Price Breakdown</h2>
            <div className="price-row">
              <span>Subtotal</span>
              <strong>?{subtotal}</strong>
            </div>
            <div className="price-row">
              <span>Delivery Charge</span>
              <strong>{deliveryCharge === 0 ? 'Free' : `?${deliveryCharge}`}</strong>
            </div>
            <div className="price-row discount">
              <span>Discount {appliedPromo ? `(${appliedPromo.code})` : ''}</span>
              <strong>-?{discount}</strong>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <strong>?{total}</strong>
            </div>
          </section>

          <section className="promo-card" aria-label="Promo code">
            <h2>Promo Code</h2>
            <form className="promo-form" onSubmit={handleApplyPromo}>
              <input
                type="text"
                value={promoCode}
                onChange={(event) => {
                  setPromoCode(event.target.value)
                  setPromoMessage('')
                }}
                placeholder="Enter promo code"
                autoComplete="off"
              />
              <button type="submit">Apply</button>
            </form>
            {promoMessage ? (
              <p
                className={`promo-message ${promoMessage.includes('Invalid') || promoMessage.includes('Please') || promoMessage.includes('Minimum') ? 'error' : 'success'}`}
                role="status"
              >
                {promoMessage}
              </p>
            ) : null}

            <div className="available-promos">
              <h3>Available Offers</h3>
              {availablePromoCodes.map((promo) => (
                <div
                  key={promo.code}
                  className={`promo-tag ${appliedPromo?.code === promo.code ? 'applied' : ''}`}
                  onClick={() => handlePromoTagClick(promo.code)}
                >
                  <span className="promo-code-badge">{promo.code}</span>
                  <span className="promo-desc">{promo.description}</span>
                  {appliedPromo?.code === promo.code && (
                    <span className="promo-applied-tick">?</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <button
            className="proceed-button"
            type="button"
            disabled={selectedServices.length === 0}
            onClick={() => navigate('/schedule')}
          >
            Proceed to Schedule
          </button>
        </>
      )}
    </main>
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

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12l1 13H5L6 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export default CartPage
