import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'
import Service from './models/Service.js'
import Order from './models/Order.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 10000

// middleware
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://hexa-laundary.vercel.app',
    'https://laundary-web-application.vercel.app' // <-- Vercel domain added here
  ]
}))

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

// ---------------- ROUTES ----------------

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

// root
app.get("/", (req, res) => {
  res.json({ message: "Hexa Laundary Backend Running 🚀" })
})

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email or mobile already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      fullName,
      mobile,
      email,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: "Account created successfully. You can login now." })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    res.json({
      message: "Login successful! Welcome to Hexa Laundary.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------------- SERVICES ----------------

// GET all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add service
app.post('/api/services', async (req, res) => {
  try {
    const service = new Service(req.body)
    await service.save()
    res.status(201).json(service)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------------- ORDERS ----------------

// POST place order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json({ message: "Order placed successfully!", order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET user orders
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single order
app.get('/api/orders/detail/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) return res.status(404).json({ message: "Order not found." })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) return res.status(404).json({ message: "Order not found." })

    if (req.body.status === 'Cancelled') {
      const ageMs = Date.now() - new Date(order.createdAt).getTime()
      if (ageMs > 15 * 60 * 1000) {
        return res.status(403).json({
          message: "Orders can only be cancelled within 15 minutes of being placed.",
        })
      }
    }

    order.status = req.body.status
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------------- START ----------------
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`)
})

// Vercel Serverless requirements ke liye export default app add kar diya hai
export default app;