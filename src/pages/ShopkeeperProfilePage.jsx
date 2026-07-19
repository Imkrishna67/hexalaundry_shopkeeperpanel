import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShopSession, clearShopSession } from '../services/auth.js'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import '../dashboard.css'

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.6 6.6A13.16 13.16 0 0 0 2 12s3.5 7 10 7a9.12 9.12 0 0 0 3.4-.64" /><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
  )
}

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']

export default function ShopkeeperProfilePage() {
  const navigate = useNavigate()
  const session = getShopSession()

  const [tab, setTab] = useState('info')
  const [form, setForm] = useState({
    shopName: session?.shopName || 'My Laundry Shop',
    ownerName: session?.ownerName || 'Shop Owner',
    email: session?.email || 'shop@hexa.com',
    phone: '9876543210',
    address: '12, Green Park, Delhi',
    city: 'Delhi',
    pincode: '110016',
  })
  const [banner, setBanner] = useState(null)

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const [pwdError, setPwdError] = useState('')
  const [pwdBanner, setPwdBanner] = useState(null)

  function updateProfile(e) {
    e.preventDefault()
    setBanner({ type: 'success', message: 'Profile updated successfully!' })
    setTimeout(() => setBanner(null), 2500)
  }

  function changePassword(e) {
    e.preventDefault()
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdError('All password fields are required')
      return
    }
    if (pwd.next.length < 6) {
      setPwdError('New password must be at least 6 characters')
      return
    }
    if (pwd.next !== pwd.confirm) {
      setPwdError('New password and confirm password do not match')
      return
    }
    setPwdError('')
    setPwdBanner({ type: 'success', message: 'Password changed successfully!' })
    setPwd({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwdBanner(null), 2500)
  }

  function handleLogout() {
    clearShopSession()
    navigate('/login')
  }

  return (
    <DashboardLayout active="profile">
      <div className="page-head">
        <h1>Shop Profile</h1>
        <p className="page-sub">Manage your shop details and security</p>
      </div>

      <div className="profile-tabs">
        <button className={`profile-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>Profile Info</button>
        <button className={`profile-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>Change Password</button>
      </div>

      {tab === 'info' && (
        <section className="dash-card">
          {banner && <div className={banner.type === 'success' ? 'success-message' : 'error-message'}>{banner.message}</div>}
          <form className="profile-form" onSubmit={updateProfile}>
            <div className="field-group">
              <label>Shop Name</label>
              <input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
            </div>
            <div className="field-group">
              <label>Owner Name</label>
              <input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input value={form.email} readOnly className="input-readonly" />
              <span className="field-hint">Email is your login identity and cannot be changed.</span>
            </div>
            <div className="field-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="field-group">
              <label>Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="field-group">
              <label>City</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Pincode</label>
              <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>

            <button type="submit" className="primary-button profile-save">Update Profile</button>
          </form>
        </section>
      )}

      {tab === 'password' && (
        <section className="dash-card">
          {pwdBanner && <div className={pwdBanner.type === 'success' ? 'success-message' : 'error-message'}>{pwdBanner.message}</div>}
          {pwdError && <div className="error-message">{pwdError}</div>}
          <form className="profile-form" onSubmit={changePassword}>
            <div className="field-group">
              <label>Current Password</label>
              <div className="input-with-action">
                <input
                  type={show.current ? 'text' : 'password'}
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  style={{ paddingRight: 52 }}
                />
                <button type="button" className="password-toggle" onClick={() => setShow((s) => ({ ...s, current: !s.current }))} aria-label="Toggle">
                  <EyeIcon open={show.current} />
                </button>
              </div>
            </div>
            <div className="field-group">
              <label>New Password</label>
              <div className="input-with-action">
                <input
                  type={show.next ? 'text' : 'password'}
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  style={{ paddingRight: 52 }}
                />
                <button type="button" className="password-toggle" onClick={() => setShow((s) => ({ ...s, next: !s.next }))} aria-label="Toggle">
                  <EyeIcon open={show.next} />
                </button>
              </div>
            </div>
            <div className="field-group">
              <label>Confirm New Password</label>
              <div className="input-with-action">
                <input
                  type={show.confirm ? 'text' : 'password'}
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  style={{ paddingRight: 52 }}
                />
                <button type="button" className="password-toggle" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} aria-label="Toggle">
                  <EyeIcon open={show.confirm} />
                </button>
              </div>
            </div>

            <button type="submit" className="primary-button profile-save">Change Password</button>
          </form>
        </section>
      )}

      <section className="dash-card danger-zone">
        <h2>Danger Zone</h2>
        <div className="danger-row">
          <div>
            <div className="danger-title">Logout</div>
            <div className="danger-sub">Clear your session and return to the login screen.</div>
          </div>
          <button className="danger-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </section>
    </DashboardLayout>
  )
}
