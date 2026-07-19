const STORAGE_KEY = 'hexalaundaryOrderHistory'

const demoOrders = [
  {
    id: 'HL-8A3F21B4',
    status: 'ongoing',
    date: 'Jun 20, 2026',
    services: [
      { id: 'regular-wash', name: 'Regular Wash', quantity: 2, price: 80, lineTotal: 160 },
      { id: 'shirt-iron', name: 'Shirt Iron', quantity: 3, price: 40, lineTotal: 120 },
    ],
    subtotal: 280,
    discount: 20,
    deliveryCharge: 40,
    total: 300,
    paymentMethod: 'UPI',
    pickupDate: '2026-06-20',
    pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
    deliveryDate: '2026-06-22',
    deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
    pickupAddress: { houseNo: 'A-102', street: 'Green Park', city: 'New Delhi', pincode: '110016', landmark: 'Near Metro Station' },
    deliveryAddress: { houseNo: 'A-102', street: 'Green Park', city: 'New Delhi', pincode: '110016', landmark: 'Near Metro Station' },
  },
  {
    id: 'HL-7D2E91C8',
    status: 'completed',
    date: 'Jun 15, 2026',
    services: [
      { id: 'premium-wash', name: 'Premium Wash', quantity: 1, price: 120, lineTotal: 120 },
      { id: 'suit-dry-clean', name: 'Suit Dry Clean', quantity: 1, price: 350, lineTotal: 350 },
    ],
    subtotal: 470,
    discount: 0,
    deliveryCharge: 40,
    total: 510,
    paymentMethod: 'Credit Card',
    pickupDate: '2026-06-15',
    pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
    deliveryDate: '2026-06-17',
    deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
    pickupAddress: { houseNo: 'B-204', street: 'MG Road', city: 'Bangalore', pincode: '560001', landmark: '' },
    deliveryAddress: { houseNo: 'B-204', street: 'MG Road', city: 'Bangalore', pincode: '560001', landmark: '' },
  },
  {
    id: 'HL-9C1B45D2',
    status: 'completed',
    date: 'Jun 10, 2026',
    services: [
      { id: 'sneaker-clean', name: 'Sneaker Clean', quantity: 1, price: 399, lineTotal: 399 },
    ],
    subtotal: 399,
    discount: 0,
    deliveryCharge: 40,
    total: 439,
    paymentMethod: 'Cash',
    pickupDate: '2026-06-10',
    pickupSlot: 'Afternoon · 12:00 PM - 4:00 PM',
    deliveryDate: '2026-06-12',
    deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
    pickupAddress: { houseNo: 'C-305', street: 'Park Street', city: 'Kolkata', pincode: '700016', landmark: 'Near Mall' },
    deliveryAddress: { houseNo: 'C-305', street: 'Park Street', city: 'Kolkata', pincode: '700016', landmark: 'Near Mall' },
  },
  {
    id: 'HL-5F8A73E1',
    status: 'cancelled',
    date: 'Jun 5, 2026',
    services: [
      { id: 'blanket-wash', name: 'Blanket Wash', quantity: 1, price: 250, lineTotal: 250 },
    ],
    subtotal: 250,
    discount: 0,
    deliveryCharge: 40,
    total: 290,
    paymentMethod: 'UPI',
    pickupDate: '2026-06-05',
    pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
    deliveryDate: '2026-06-07',
    deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
    pickupAddress: { houseNo: 'D-110', street: 'Linking Road', city: 'Mumbai', pincode: '400050', landmark: '' },
    deliveryAddress: { houseNo: 'D-110', street: 'Linking Road', city: 'Mumbai', pincode: '400050', landmark: '' },
  },
]

export const orderService = {
  getOrders() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // ignore parse errors
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoOrders))
    } catch {
      // ignore storage errors
    }
    return demoOrders
  },

  getOrderById(id) {
    const orders = this.getOrders()
    return orders.find((o) => o.id === id) || null
  },

  reorder(orderId) {
    const order = this.getOrderById(orderId)
    if (!order) return
    const cart = {}
    order.services.forEach((s) => {
      cart[s.id] = (cart[s.id] || 0) + s.quantity
    })
    localStorage.setItem('hexalaundaryCart', JSON.stringify(cart))
  },

  addOrder(order) {
    const orders = this.getOrders()
    const newOrder = {
      ...order,
      id: `HL-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'ongoing',
    }
    orders.unshift(newOrder)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {
      // ignore
    }
    return newOrder
  },
}
