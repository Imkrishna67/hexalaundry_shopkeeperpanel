import { useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import '../dashboard.css'

const TIME_PERIODS = ['This Week', 'This Month', 'Last 30 Days', 'This Year']

const MOCK_STATS = [
  { label: 'Total Revenue', value: '₹24,850', tone: 'success' },
  { label: 'Average Order Value', value: '₹420', tone: 'primary' },
  { label: 'Active Customers', value: '148', tone: 'purple' },
  { label: 'Order Completion Rate', value: '94.2%', tone: 'warning' },
]

const REVENUE_DATA = [
  { day: 'Mon', value: 3200 },
  { day: 'Tue', value: 4100 },
  { day: 'Wed', value: 2800 },
  { day: 'Thu', value: 5600 },
  { day: 'Fri', value: 4900 },
  { day: 'Sat', value: 7200 },
  { day: 'Sun', value: 3100 },
]

const SERVICE_DATA = [
  { name: 'Wash + Iron', orders: 342, revenue: '₹1,53,900', share: 38 },
  { name: 'Dry Clean', orders: 218, revenue: '₹1,09,000', share: 28 },
  { name: 'Iron Only', orders: 156, revenue: '₹37,440', share: 18 },
  { name: 'Wash + Fold', orders: 124, revenue: '₹37,200', share: 16 },
]

export default function ShopkeeperAnalyticsPage() {
  const [period, setPeriod] = useState(TIME_PERIODS[2])

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value))

  return (
    <DashboardLayout active="analytics">
      <div className="analytics-page">
        <div className="analytics-head">
          <div>
            <h1>Analytics</h1>
            <p className="page-sub">Track your laundry business growth, revenue, and popular services</p>
          </div>
          <select
            className="analytics-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {TIME_PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="analytics-stats-grid">
          {MOCK_STATS.map((s) => (
            <div key={s.label} className={`analytics-stat-card tone-${s.tone}`}>
              <div className="analytics-stat-value">{s.value}</div>
              <div className="analytics-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="analytics-charts-row">
          <div className="dash-card analytics-chart-box">
            <div className="dash-card-head">
              <h2>Revenue Trends & Orders</h2>
            </div>
            <div className="chart-bars">
              {REVENUE_DATA.map((d) => {
                const heightPct = (d.value / maxRevenue) * 100
                return (
                  <div key={d.day} className="chart-bar-group">
                    <div className="chart-bar-wrap">
                      <div className="chart-bar" style={{ height: `${heightPct}%` }}>
                        <span className="chart-bar-value">₹{d.value.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="chart-bar-label">{d.day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* FIXED: Order Status Distribution containing ALL 6 status values */}
          <div className="dash-card analytics-chart-box">
            <div className="dash-card-head">
              <h2>Order Status Distribution</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', padding: '10px 0' }}>
              
              {/* SVG Donut Ring Representation (Covers all 6 statuses sequentially) */}
              <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <svg width="100%" height="100%" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#252d38" strokeWidth="4.5"></circle>
                  
                  {/* Completed Segment (Green) - 50% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#56d364" strokeWidth="4.5" 
                          strokeDasharray="50 50" strokeDashoffset="25"></circle>
                  
                  {/* Ready Segment (Blue) - 15% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                          strokeDasharray="15 85" strokeDashoffset="-25"></circle>
                  
                  {/* In-Progress Segment (Purple) - 15% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.5" 
                          strokeDasharray="15 85" strokeDashoffset="-40"></circle>

                  {/* Accepted Segment (Cyan/Teal) - 10% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0ea5e9" strokeWidth="4.5" 
                          strokeDasharray="10 90" strokeDashoffset="-55"></circle>

                  {/* Pending Segment (Yellow) - 7% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e3b341" strokeWidth="4.5" 
                          strokeDasharray="7 93" strokeDashoffset="-65"></circle>

                  {/* Cancelled Segment (Red) - 3% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                          strokeDasharray="3 97" strokeDashoffset="-72"></circle>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '18%',
                  left: '18%',
                  width: '64%',
                  height: '64%',
                  background: '#1c2128',
                  borderRadius: '50%'
                }}></div>
              </div>

              {/* Exact Horizontal Footer mapping all 6 items */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 16px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e3b341' }}></span>
                  <span style={{ color: '#e3b341' }}>Pending</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9' }}></span>
                  <span style={{ color: '#0ea5e9' }}>Accepted</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span>
                  <span style={{ color: '#a855f7' }}>In-Progress</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
                  <span style={{ color: '#3b82f6' }}>Ready</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#56d364' }}></span>
                  <span style={{ color: '#56d364' }}>Completed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                  <span style={{ color: '#ef4444' }}>Cancelled</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="dash-card analytics-chart-box">
          <div className="dash-card-head">
            <h2>Service Popularity Breakdown</h2>
          </div>
          <div className="chart-service-list">
            {SERVICE_DATA.map((item) => (
              <div key={item.name} className="chart-service-row">
                <div className="chart-service-meta">
                  <span className="chart-service-name">{item.name}</span>
                  <span className="chart-service-revenue">{item.revenue}</span>
                </div>
                <div className="chart-service-bar-wrap">
                  <div className="chart-service-bar" style={{ width: `${item.share}%` }} />
                </div>
                <span className="chart-service-share">{item.share}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card analytics-chart-box">
          <div className="dash-card-head">
            <h2>Top Performing Services</h2>
          </div>
          <div className="table-wrap">
            <table className="orders-table analytics-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Orders Placed</th>
                  <th>Total Revenue Generated</th>
                  <th>Growth Trend</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_DATA.map((s, idx) => (
                  <tr key={s.name}>
                    <td>
                      <div className="svc-name">{s.name}</div>
                    </td>
                    <td>{s.orders}</td>
                    <td className="cell-amount">{s.revenue}</td>
                    <td>
                      <span className={`trend-trend trend-${idx === 0 ? 'up' : idx === 1 ? 'up' : 'down'}`}>
                        {idx === 0 ? '↑ 12.4%' : idx === 1 ? '↑ 8.2%' : idx === 2 ? '↓ 2.1%' : '↓ 0.5%'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}