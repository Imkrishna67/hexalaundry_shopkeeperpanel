import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../service-selection.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'
const categories = ['Wash', 'Dry Clean', 'Iron', 'Premium Care']

function ServiceSelectionPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [cartItems, setCartItems] = useState(() => readCartItems())
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch services from MongoDB
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

  useEffect(() => {
    localStorage.setItem('hexalaundaryCart', JSON.stringify(cartItems))
  }, [cartItems])

  const filteredServices = useMemo(
    () => services.filter((service) => service.category === activeCategory),
    [activeCategory, services],
  )

  const totalItems = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)
  const totalAmount = services.reduce((total, service) => {
    return total + service.price * (cartItems[service._id] || 0)
  }, 0)

  function updateQuantity(serviceId, nextQuantity) {
    setCartItems((currentCart) => {
      const nextCart = { ...currentCart }
      if (nextQuantity <= 0) {
        delete nextCart[serviceId]
      } else {
        nextCart[serviceId] = nextQuantity
      }
      return nextCart
    })
  }

  return (
    <main className="service-page">
      <header className="service-header">
        <button className="back-button" type="button" aria-label="Go back" onClick={() => navigate('/home')}>
          <BackIcon />
        </button>
        <h1>Select Services</h1>
      </header>

      <nav className="category-tabs" aria-label="Service categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <div className="loading-state">
          <p>Loading services...</p>
        </div>
      ) : (
        <section className="service-list" aria-label={`${activeCategory} services`}>
          {filteredServices.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem' }}>
              No services available in this category.
            </p>
          ) : (
            filteredServices.map((service) => {
              const quantity = cartItems[service._id] || 0

              return (
                <article className="service-list-card" key={service._id}>
                  <div className="service-visual" aria-hidden="true">
                    <ServiceIcon category={service.category} />
                  </div>

                  <div className="service-info">
                    <h2>{service.name}</h2>
                    <p>{service.description}</p>
                    <div className="service-price">
                      ?{service.price} <span>/{service.unit || 'per piece'}</span>
                    </div>
                  </div>

                  {quantity > 0 ? (
                    <div className="quantity-control" aria-label={`${service.name} quantity`}>
                      <button
                        className="quantity-button"
                        type="button"
                        aria-label={`Decrease ${service.name} quantity`}
                        onClick={() => updateQuantity(service._id, quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{quantity}</span>
                      <button
                        className="quantity-button"
                        type="button"
                        aria-label={`Increase ${service.name} quantity`}
                        onClick={() => updateQuantity(service._id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-button"
                      type="button"
                      aria-label={`Add ${service.name}`}
                      onClick={() => updateQuantity(service._id, 1)}
                    >
                      + Add
                    </button>
                  )}
                </article>
              )
            })
          )}
        </section>
      )}

      <footer className="service-bottom-bar" aria-label="Cart summary">
        <div className="cart-summary">
          <span>Total Items</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="cart-summary">
          <span>Total</span>
          <strong>?{totalAmount}</strong>
        </div>
        <button
          className="view-cart-button"
          type="button"
          disabled={totalItems === 0}
          onClick={() => navigate('/cart')}
        >
          View Cart
        </button>
      </footer>
    </main>
  )
}

function ServiceIcon({ category }) {
  switch (category) {
    case 'Wash': return <WashIcon />
    case 'Dry Clean': return <ShirtIcon />
    case 'Iron': return <IronIcon />
    case 'Premium Care': return <SparkleIcon />
    default: return <WashIcon />
  }
}

function readCartItems() {
  try {
    const storedCart = localStorage.getItem('hexalaundaryCart')
    return storedCart ? JSON.parse(storedCart) : {}
  } catch {
    return {}
  }
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function ShirtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4 5 6l2 5H5v9h14v-9h-2l2-5-3-2-4 3-4-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function IronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10 14.5 3H18l3 3v5l-3 3H9l-4 4v-4l2-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export default ServiceSelectionPage
