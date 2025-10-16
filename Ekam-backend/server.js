require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// `uploads` மற்றும் அதன் துணைக் கோப்புறைகள் இருக்கிறதா என்று பார்த்து, இல்லையென்றால் உருவாக்கும்
const uploadsDir = path.join(__dirname, 'uploads');
const reviewsDir = path.join(uploadsDir, 'reviews');
const offersDir = path.join(uploadsDir, 'offers');
const productsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(reviewsDir)) fs.mkdirSync(reviewsDir);
if (!fs.existsSync(offersDir)) fs.mkdirSync(offersDir);
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- `uploads` கோப்புறையில் உள்ள படங்களை வெளிப்புறமாகக் காட்ட ---
// Intha line thaan maathiri മാറ്റം senjirukom, path-a innum theliva solrathuku.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully."))
.catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
const offerRoutes = require('./routes/offers');
const productRoutes = require('./routes/productroutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviews'); // Review routes இறக்குமதி செய்யப்பட்டது

app.use('/api/offers', offerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes); // Review routes பயன்படுத்தப்படுகிறது

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
});
