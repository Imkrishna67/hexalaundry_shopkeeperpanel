import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../schedule.css'

const timeSlots = [
  {
    label: 'Morning',
    value: 'Morning · 6:00 AM - 10:00 AM',
  },
  {
    label: 'Afternoon',
    value: 'Afternoon · 12:00 PM - 4:00 PM',
  },
  {
    label: 'Evening',
    value: 'Evening · 6:00 PM - 10:00 PM',
  },
]

function SchedulePage() {
  const navigate = useNavigate()
  const today = getTodayInputValue()
  const tomorrow = addDaysToInputValue(today, 1)
  const [pickupDate, setPickupDate] = useState(today)
  const [deliveryDate, setDeliveryDate] = useState(tomorrow)
  const [pickupSlot, setPickupSlot] = useState(timeSlots[0].value)
  const [deliverySlot, setDeliverySlot] = useState(timeSlots[2].value)
  const [instructions, setInstructions] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const formattedPickupDate = useMemo(() => formatDate(pickupDate), [pickupDate])
  const formattedDeliveryDate = useMemo(() => formatDate(deliveryDate), [deliveryDate])

  function handleConfirmSchedule(event) {
    event.preventDefault()

    if (!pickupDate || !deliveryDate) {
      setMessage({ type: 'error', text: 'Please select both pickup and delivery dates.' })
      return
    }

    if (deliveryDate < pickupDate) {
      setMessage({ type: 'error', text: 'Delivery date cannot be before pickup date.' })
      return
    }

    const schedule = {
      pickupDate,
      pickupSlot,
      deliveryDate,
      deliverySlot,
      instructions: instructions.trim(),
      confirmedAt: new Date().toISOString(),
    }

    localStorage.setItem('hexalaundarySchedule', JSON.stringify(schedule))
    setMessage({
      type: 'success',
      text: `Schedule confirmed. Pickup on ${formatDate(pickupDate)}, ${pickupSlot}.`,
    })
    window.setTimeout(() => navigate('/address'), 700)
  }

  return (
    <main className="schedule-page">
      <header className="schedule-header">
        <button className="schedule-back-button" type="button" aria-label="Go back" onClick={() => navigate('/cart')}>
          <BackIcon />
        </button>
        <h1>Schedule Pickup</h1>
      </header>

      <form className="schedule-form" onSubmit={handleConfirmSchedule}>
        <section className="schedule-card" aria-labelledby="pickup-title">
          <h2 id="pickup-title">Pickup Details</h2>

          <div className="field-group">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input
              id="pickup-date"
              className="date-input"
              type="date"
              value={pickupDate}
              min={today}
              onChange={(event) => {
                setPickupDate(event.target.value)
                setMessage({ type: '', text: '' })

                if (deliveryDate < event.target.value) {
                  setDeliveryDate(event.target.value)
                }
              }}
            />
            {pickupDate ? <p className="helper-text">Selected: {formattedPickupDate}</p> : null}
          </div>

          <div className="field-group">
            <label>Pickup Time Slot</label>
            <div className="slot-grid">
              {timeSlots.map((slot) => {
                const isActive = pickupSlot === slot.value;
                return (
                  <button
                    key={slot.value}
                    className={`slot-button ${isActive ? 'active' : ''}`}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setPickupSlot(slot.value)
                      setMessage({ type: '', text: '' })
                    }}
                  >
                    <span style={isActive ? { color: '#000000', fontWeight: '700' } : {}}>{slot.label}</span>
                    {/* ?? TICK LOGIC FIXED: Ab sirf active hone par hi render hoga aur rang black rahega */}
                    {isActive && <span aria-hidden="true" style={{ color: '#000000' }}>?</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="schedule-card" aria-labelledby="delivery-title">
          <h2 id="delivery-title">Delivery Details</h2>

          <div className="field-group">
            <label htmlFor="delivery-date">Delivery Date</label>
            <input
              id="delivery-date"
              className="date-input"
              type="date"
              value={deliveryDate}
              min={pickupDate}
              onChange={(event) => {
                setDeliveryDate(event.target.value)
                setMessage({ type: '', text: '' })
              }}
            />
            {deliveryDate ? <p className="helper-text">Selected: {formattedDeliveryDate}</p> : null}
          </div>

          <div className="field-group">
            <label>Delivery Time Slot</label>
            <div className="slot-grid">
              {timeSlots.map((slot) => {
                const isActive = deliverySlot === slot.value;
                return (
                  <button
                    key={slot.value}
                    className={`slot-button ${isActive ? 'active' : ''}`}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setDeliverySlot(slot.value)
                      setMessage({ type: '', text: '' })
                    }}
                  >
                    <span style={isActive ? { color: '#000000', fontWeight: '700' } : {}}>{slot.label}</span>
                    {/* ?? TICK LOGIC FIXED: Ab sirf active hone par hi render hoga aur rang black rahega */}
                    {isActive && <span aria-hidden="true" style={{ color: '#000000' }}>?</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="schedule-card" aria-labelledby="instructions-title">
          <h2 id="instructions-title">Special Instructions</h2>
          <label className="instructions-label" htmlFor="instructions">
            Optional notes for delivery person
          </label>
          <textarea
            id="instructions"
            className="instructions-input"
            value={instructions}
            onChange={(event) => {
              setInstructions(event.target.value)
              setMessage({ type: '', text: '' })
            }}
            placeholder="Example: Call before arrival, keep at front desk..."
            maxLength={300}
          />
        </section>

        {message.text ? (
          <p className={`form-message ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        ) : null}

        <button className="confirm-button" type="submit">
          Confirm Schedule
        </button>
      </form>
    </main>
  )
}

function getTodayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addDaysToInputValue(dateValue, daysToAdd) {
  const date = new Date(`${dateValue}T00:00:00`)
  date.setDate(date.getDate() + daysToAdd)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
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

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default SchedulePage
