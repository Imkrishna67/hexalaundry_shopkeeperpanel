import { useUser } from '@clerk/clerk-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContextValues.jsx'
import '../home.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

const promoSlides = [
  {
    badge: 'New User Offer',
    title: 'Get 20% OFF on your first wash',
    description: 'Fresh clothes, doorstep pickup, and fast delivery.',
  },
  {
    badge: 'Weekend Deal',
    title: 'Free pickup on orders above ?799',
    description: 'Book today and enjoy contactless laundry service.',
  },
  {
    badge: 'Premium Care',
    title: 'Dry clean 3 shirts at ?299',
    description: 'Premium fabric care for office and party wear.',
  },
]

const services = [
  { name: 'Wash', description: 'Everyday clothes', icon: WashIcon },
  { name: 'Dry Clean', description: 'Suits & formal wear', icon: DryIcon },
  { name: 'Iron', description: 'Steam & press', icon: IronIcon },
  { name: 'Shoe Clean', description: 'Sneakers & sports shoes', icon: ShoeIcon },
  { name: 'Bedding', description: 'Bedsheets & blankets', icon: BeddingIcon },
  { name: 'Fold & Pack', description: 'Neat finishing', icon: FoldIcon },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button className="icon-button theme-toggle" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={toggle}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function getUserName() {
  try {
    const storedUser = localStorage.getItem('hexalaundaryUser')
    if (!storedUser) return 'there'
    const user = JSON.parse(storedUser)
    const name = user.fullName || user.identifier || 'there'
    if (!name) return 'there'
    if (name.includes('@')) return name.split('@')[0]
    return name.split(' ')[0]
  } catch {
    return 'there'
  }
}

function formatOrderDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function HomePage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeOrder, setActiveOrder] = useState(null)

  // Fetch latest active order from MongoDB
  useEffect(() => {
    async function fetchActiveOrder() {
      try {
        const user = JSON.parse(localStorage.getItem('hexalaundaryUser') || '{}')
        if (!user.email) return

        const response = await fetch(`${apiBaseUrl}/api/orders/${encodeURIComponent(user.email)}`)
        const orders = await response.json()

        const ongoing = orders.find((order) =>
          !['Delivered', 'Cancelled'].includes(order.status)
        )
        setActiveOrder(ongoing || null)
      } catch (err) {
        console.error('Failed to fetch active order:', err)
      }
    }
    fetchActiveOrder()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentIndex) => (currentIndex + 1) % promoSlides.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const searchableText = `${service.name} ${service.description}`.toLowerCase()
        return searchableText.includes(searchText.toLowerCase())
      }),
    [searchText],
  )

  return (
    <main className="home-page">
      <header className="home-header">
        <div>
          <p className="eyebrow">Hexa Laundary</p>
          <h1>Hi, {user?.firstName || 'there'}</h1>
        </div>
        <div className="header-actions" aria-label="Account actions">
          <ThemeToggle />
          <button className="icon-button" type="button" aria-label="Cart" onClick={() => navigate('/cart')}>
            <CartIcon />
          </button>
        </div>
      </header>

      <div className="search-wrapper" aria-label="Search services">
        <span className="search-icon-wrap"><SearchIcon /></span>
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search for wash, iron..."
        />
      </div>

      <section className="promo-banner" aria-label="Promotional offers">
        <div className="promo-content">
          <span className="promo-badge">{promoSlides[activeSlide].badge}</span>
          <h2>{promoSlides[activeSlide].title}</h2>
          <p>{promoSlides[activeSlide].description}</p>
        </div>
        <div className="carousel-dots" aria-label="Offer carousel">
          {promoSlides.map((_, index) => (
            <button
              key={promoSlides[index].badge}
              className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
              type="button"
              aria-label={`Show offer ${index + 1}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="services-title">
        <div className="section-header">
          <h2 id="services-title">Services</h2>
          <button className="see-all" type="button" onClick={() => navigate('/services')}>
            See all
          </button>
        </div>

        <div className="service-grid">
          {filteredServices.map((service) => {
            const ServiceIcon = service.icon
            return (
              <button
                className="service-card"
                key={service.name}
                type="button"
                onClick={() => navigate('/services')}
              >
                <span className="service-icon"><ServiceIcon /></span>
                <span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </span>
              </button>
            )
          })}
        </div>

        {filteredServices.length === 0 && (
          <p className="no-results">No services found for your search.</p>
        )}
      </section>

      {activeOrder && (
        <section className="active-order-card" aria-labelledby="active-order-title">
          <div className="order-top">
            <div>
              <h2 id="active-order-title">Active Order</h2>
              <p className="order-meta">
                #{activeOrder._id.slice(-8).toUpperCase()} · {activeOrder.services.reduce((c, s) => c + s.quantity, 0)} items
              </p>
            </div>
            <span className="status-pill">{activeOrder.status}</span>
          </div>

          <div className="order-timeline">
            <label className="timeline-item active">
              <input className="timeline-checkbox" type="checkbox" checked readOnly />
              <div>
                <h3>Pickup scheduled</h3>
                <p>
                  {activeOrder.pickupDate
                    ? `${formatOrderDate(activeOrder.pickupDate)} · ${activeOrder.pickupTime?.split(' · ')[0] || 'Slot pending'}`
                    : 'Pickup pending'}
                </p>
              </div>
            </label>
            <label className="timeline-item in-progress">
              <input className="timeline-checkbox" type="checkbox" readOnly />
              <div>
                <h3>Washing in progress</h3>
                <p>
                  {activeOrder.deliveryDate
                    ? `Expected by ${formatOrderDate(activeOrder.deliveryDate)}`
                    : 'Expected soon'}
                </p>
              </div>
            </label>
          </div>

          <button className="view-order-button" type="button" onClick={() => navigate('/track-order')}>
            View Active Order
          </button>
        </section>
      )}

      <button className="pickup-button" type="button" onClick={() => navigate('/services')}>
        Book a Pickup
      </button>
    </main>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function WashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8l2 16H6L8 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10 14.5 3H18l3 3v5l-3 3H9l-4 4v-4l2-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ShoeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 15c3-1 5-1 7 0l7 3h4v-4l-5-5-7 1-6 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 15c1 2 3 3 6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BeddingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h13a3 3 0 0 1 3 3v8H5a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FoldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h7v7H4V6ZM13 11h7v7h-7v-7ZM4 15h7v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3ZM15 4h3a2 2 0 0 1 2 2v5h-5V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6h15l-2 9H8L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 5 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  )
}

export default HomePage
