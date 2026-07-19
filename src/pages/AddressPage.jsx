import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../address.css'

const emptyAddressForm = {
  houseNo: '',
  street: '',
  city: '',
  pincode: '',
  landmark: '',
}

function AddressPage() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState(readAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const storedAddresses = readAddresses()
    return storedAddresses[0]?.id || ''
  })
  const [editingAddressId, setEditingAddressId] = useState('')
  const [form, setForm] = useState(emptyAddressForm)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    localStorage.setItem('hexalaundaryAddresses', JSON.stringify(addresses))
  }, [addresses])

  function resetForm() {
    setForm(emptyAddressForm)
    setSelectedAddressId('')
    setEditingAddressId('')
    setMessage({ type: '', text: '' })
  }

  function selectAddress(addressId) {
    setSelectedAddressId(addressId)
    setEditingAddressId('')
    setForm(emptyAddressForm)
    setMessage({ type: '', text: '' })
  }

  function editAddress(address) {
    setSelectedAddressId(address.id)
    setEditingAddressId(address.id)
    setForm({
      houseNo: address.houseNo,
      street: address.street,
      city: address.city,
      pincode: address.pincode,
      landmark: address.landmark,
    })
    setMessage({ type: '', text: '' })
  }

  function deleteAddress(addressId) {
    setAddresses((currentAddresses) => currentAddresses.filter((address) => address.id !== addressId))

    if (selectedAddressId === addressId) {
      setSelectedAddressId('')
    }

    if (editingAddressId === addressId) {
      resetForm()
    }

    setMessage({ type: 'success', text: 'Address removed successfully.' })
  }

  function useCurrentLocation() {
    setMessage({ type: '', text: '' })

    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Current location is not supported by this browser.' })
      return
    }

    setMessage({ type: 'success', text: 'Detecting your current location...' })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        setForm((currentForm) => ({
          ...currentForm,
          houseNo: currentForm.houseNo || 'Near current location',
          street: currentForm.street || 'Current area',
          city: currentForm.city || 'Current City',
          landmark: currentForm.landmark || `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }))
        setMessage({ type: 'success', text: 'Current location detected. Please complete the address details.' })
      },
      () => {
        setMessage({ type: 'error', text: 'Unable to access current location. You can enter the address manually.' })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  function handleSaveAndContinue(event) {
    event.preventDefault()

    const hasFormValues = Object.values(form).some((value) => value.trim())
    const pincodePattern = /^\d{6}$/

    if (!selectedAddressId && !hasFormValues) {
      setMessage({ type: 'error', text: 'Please select a saved address or add a new address.' })
      return
    }

    if (hasFormValues) {
      if (!form.houseNo.trim() || !form.street.trim() || !form.city.trim() || !pincodePattern.test(form.pincode.trim())) {
        setMessage({ type: 'error', text: 'Please fill house number, street, city, and a valid 6-digit pincode.' })
        return
      }

      const addressPayload = {
        houseNo: form.houseNo.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        landmark: form.landmark.trim(),
      }

      if (editingAddressId) {
        setAddresses((currentAddresses) =>
          currentAddresses.map((address) =>
            address.id === editingAddressId ? { ...address, ...addressPayload } : address,
          ),
        )
        setSelectedAddressId(editingAddressId)
        setMessage({ type: 'success', text: 'Address updated successfully.' })
        setEditingAddressId('')
      } else {
        const newAddress = {
          id: `address-${Date.now()}`,
          ...addressPayload,
        }

        setAddresses((currentAddresses) => [...currentAddresses, newAddress])
        setSelectedAddressId(newAddress.id)
        setMessage({ type: 'success', text: 'Address saved successfully.' })
      }

      setForm(emptyAddressForm)
      return
    }

    localStorage.setItem('hexalaundarySelectedAddressId', selectedAddressId)
    navigate('/orders')
  }

  return (
    <main className="address-page">
      <header className="address-header">
        <button className="address-back-button" type="button" aria-label="Go back" onClick={() => navigate('/schedule')}>
          <BackIcon />
        </button>
        <h1>Select Address</h1>
      </header>

      <div className="address-layout">
        <section className="address-card" aria-labelledby="saved-addresses-title">
          <h2 id="saved-addresses-title">Saved Addresses</h2>

          {addresses.length === 0 ? (
            <p className="empty-addresses">No saved addresses yet. Add a new address to continue.</p>
          ) : (
            <div className="saved-addresses">
              {addresses.map((address) => (
                <label className={`address-option ${selectedAddressId === address.id ? 'selected' : ''}`} key={address.id}>
                  <input
                    type="radio"
                    name="savedAddress"
                    checked={selectedAddressId === address.id}
                    onChange={() => selectAddress(address.id)}
                  />
                  <span className="address-text">
                    <strong>{address.houseNo}, {address.street}</strong>
                    <p>
                      {address.city} - {address.pincode}
                      {address.landmark ? ` · ${address.landmark}` : ''}
                    </p>
                  </span>
                  <span className="address-actions">
                    <button
                      className="icon-action-button"
                      type="button"
                      aria-label={`Edit ${address.houseNo}`}
                      onClick={(event) => {
                        event.preventDefault()
                        editAddress(address)
                      }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="icon-action-button delete"
                      type="button"
                      aria-label={`Delete ${address.houseNo}`}
                      onClick={(event) => {
                        event.preventDefault()
                        deleteAddress(address.id)
                      }}
                    >
                      <RemoveIcon />
                    </button>
                  </span>
                </label>
              ))}
            </div>
          )}

          <button className="add-address-button" type="button" onClick={resetForm}>
            Add New Address
          </button>
        </section>

        <section className="address-card" aria-labelledby="address-form-title">
          <h2 id="address-form-title">Address Details</h2>

          <form className="address-form" onSubmit={handleSaveAndContinue}>
            <div className="form-grid">
              <div>
                <label className="field-label" htmlFor="house-no">House No</label>
                <input
                  id="house-no"
                  className="address-input"
                  type="text"
                  value={form.houseNo}
                  onChange={(event) => {
                    setForm((currentForm) => ({ ...currentForm, houseNo: event.target.value }))
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder="House / Flat No"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="street">Street</label>
                <input
                  id="street"
                  className="address-input"
                  type="text"
                  value={form.street}
                  onChange={(event) => {
                    setForm((currentForm) => ({ ...currentForm, street: event.target.value }))
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder="Street name"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="city">City</label>
                <input
                  id="city"
                  className="address-input"
                  type="text"
                  value={form.city}
                  onChange={(event) => {
                    setForm((currentForm) => ({ ...currentForm, city: event.target.value }))
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  className="address-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(event) => {
                    setForm((currentForm) => ({ ...currentForm, pincode: event.target.value.replace(/\D/g, '').slice(0, 6) }))
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder="6-digit pincode"
                />
              </div>

              <div className="full-width">
                <label className="field-label" htmlFor="landmark">Landmark</label>
                <input
                  id="landmark"
                  className="address-input"
                  type="text"
                  value={form.landmark}
                  onChange={(event) => {
                    setForm((currentForm) => ({ ...currentForm, landmark: event.target.value }))
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder="Nearby landmark"
                />
              </div>
            </div>

            <button className="current-location-button" type="button" onClick={useCurrentLocation}>
              <MapIcon />
              Use Current Location
            </button>

            {message.text ? (
              <p className={`form-message ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
                {message.text}
              </p>
            ) : null}

            <button className="save-button" type="submit">
              Save &amp; Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

function readAddresses() {
  try {
    const storedAddresses = localStorage.getItem('hexalaundaryAddresses')

    if (storedAddresses) {
      const addresses = JSON.parse(storedAddresses)
      const filtered = addresses.filter((addr) => addr.id !== 'address-demo')
      if (filtered.length !== addresses.length) {
        localStorage.setItem('hexalaundaryAddresses', JSON.stringify(filtered))
      }
      return filtered
    }

    return []
  } catch {
    return []
  }
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default AddressPage
