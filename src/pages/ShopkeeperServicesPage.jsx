import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import '../dashboard.css'

const CATEGORIES = ['Wash', 'Dry Clean', 'Iron', 'Wash + Iron', 'Premium', 'Other']

// Mock data — replace with API calls when backend is ready.
const INITIAL_SERVICES = [
  { id: 1, name: 'Wash + Iron', category: 'Wash + Iron', price: 80, description: 'Regular wash with press.', active: true },
  { id: 2, name: 'Dry Clean Suit', category: 'Dry Clean', price: 250, description: 'Professional dry cleaning.', active: true },
  { id: 3, name: 'Premium Steam', category: 'Premium', price: 400, description: '', active: false },
]

function PenIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>)
}
function TrashIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>)
}
function PlusIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>)
}

let nextId = 100

export default function ShopkeeperServicesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [modal, setModal] = useState(null) // { id, name, category, price, description } | 'new'
  const [deleteId, setDeleteId] = useState(null)

  const activeCount = useMemo(() => services.filter((s) => s.active).length, [services])

  function openNew() {
    setModal({ id: null, name: '', category: CATEGORIES[0], price: '', description: '' })
  }

  function openEdit(s) {
    setModal({ id: s.id, name: s.name, category: s.category, price: s.price, description: s.description })
  }

  function saveService(e) {
    e.preventDefault()
    const name = modal.name.trim()
    const price = Number(modal.price)
    if (!name || !modal.category || isNaN(price) || price < 0) return

    if (modal.id == null) {
      setServices((prev) => [...prev, { id: nextId++, name, category: modal.category, price, description: modal.description, active: true }])
    } else {
      setServices((prev) => prev.map((s) => s.id === modal.id ? { ...s, name, category: modal.category, price, description: modal.description } : s))
    }
    setModal(null)
  }

  function toggleActive(id) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s))
  }

  function confirmDelete() {
    setServices((prev) => prev.filter((s) => s.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <DashboardLayout active="services">
      <div className="page-head services-head">
        <div>
          <h1>Services</h1>
          <p className="page-sub">{activeCount} active · {services.length} total</p>
        </div>
        <button className="add-service-btn" onClick={openNew}>
          <PlusIcon /> Add New Service
        </button>
      </div>

      {services.length > 0 ? (
        <section className="dash-card">
          <div className="table-wrap">
            <table className="orders-table services-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="svc-name">{s.name}</div>
                      {s.description && <div className="svc-desc">{s.description}</div>}
                    </td>
                    <td>{s.category}</td>
                    <td className="cell-amount">₹{s.price}</td>
                    <td>
                      <button
                        className={`toggle-switch ${s.active ? 'on' : ''}`}
                        onClick={() => toggleActive(s.id)}
                        aria-label={s.active ? 'Deactivate service' : 'Activate service'}
                      >
                        <span className="toggle-knob" />
                      </button>
                    </td>
                    <td>
                      <div className="svc-actions">
                        <button className="icon-action edit" onClick={() => openEdit(s)} aria-label="Edit service"><PenIcon /></button>
                        <button className="icon-action delete" onClick={() => setDeleteId(s.id)} aria-label="Delete service"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="dash-card">
          <p className="empty-state">No services added yet. Click '+ Add New Service' to get started.</p>
        </section>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="modal-scrim" onClick={() => setModal(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.id == null ? 'Add New Service' : 'Edit Service'}</h3>
            <form onSubmit={saveService}>
              <div className="field-group">
                <label>Service Name</label>
                <input
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  placeholder="e.g. Wash + Iron"
                  required
                />
              </div>

              <div className="field-group">
                <label>Category</label>
                <select value={modal.category} onChange={(e) => setModal({ ...modal, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="field-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={modal.price}
                  onChange={(e) => setModal({ ...modal, price: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="field-group">
                <label>Description (optional)</label>
                <textarea
                  rows={3}
                  value={modal.description}
                  onChange={(e) => setModal({ ...modal, description: e.target.value })}
                  placeholder="Short description"
                />
              </div>

              <div className="field-group">
                <label>Image (optional)</label>
                <input type="file" accept="image/*" />
              </div>

              <div className="confirm-actions">
                <button type="button" className="confirm-no" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="confirm-yes">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId != null && (
        <div className="modal-scrim" onClick={() => setDeleteId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Service</h3>
            <p>Are you sure you want to delete this service?</p>
            <div className="confirm-actions">
              <button className="confirm-no" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="confirm-yes danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
