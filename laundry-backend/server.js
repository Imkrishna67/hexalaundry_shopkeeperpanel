const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration (Dono frontends ke liye)
app.use(cors({ 
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true 
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🔥 MongoDB Connected Successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Root Route
app.get('/', (req, res) => {
    res.send('Laundry Backend Server Running!');
});

// --- UPDATED SHOP SCHEMA & MODEL ---
// Frontend se aane wale data ke hisaab se schema update kiya hai
const shopSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    email: { type: String, required: true },
    clerkUserId: { type: String, required: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    status: { type: String, default: "active" }
}, { timestamps: true }); // Timestamps se create/update time track hoga

const Shop = mongoose.model('Shop', shopSchema);


// --- API ROUTE FOR SAVING A SHOP (POST) ---
// 👈 Yeh route tumhari file mein missing tha!
app.post('/api/shops', async (req, res) => {
    try {
        const { shopName, email, clerkUserId } = req.body;

        // Check karte hain agar shop pehle se toh register nahi hai
        const existingShop = await Shop.findOne({ clerkUserId });
        if (existingShop) {
            return res.status(200).json({ message: 'Shop already registered!', shop: existingShop });
        }

        // Nayi shop create karke database mein save kar rahe hain
        const newShop = new Shop({
            shopName,
            email,
            clerkUserId
        });

        const savedShop = await newShop.save();
        res.status(201).json(savedShop);
    } catch (err) {
        console.error("Error in POST /api/shops:", err);
        res.status(500).json({ message: err.message });
    }
});


// --- API ROUTE FOR GETTING SHOPS (GET) ---
app.get('/api/shops', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.json(shops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});