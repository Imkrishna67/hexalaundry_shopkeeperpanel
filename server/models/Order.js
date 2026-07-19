import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  services: [{ name: String, price: Number, quantity: Number }],
  subtotal: { type: Number },
  deliveryCharge: { type: Number },
  discount: { type: Number },
  total: { type: Number },
  promoCode: { type: String },
  address: { type: String },
  pickupDate: { type: String },
  pickupTime: { type: String },
  deliveryDate: { type: String },
  deliveryTime: { type: String },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { 
    type: String, 
    default: 'Order Placed',
    enum: ['Order Placed', 'Picked Up', 'Washing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  specialInstructions: { type: String },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)