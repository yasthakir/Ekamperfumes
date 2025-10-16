// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Path module is still useful for other things, so we can keep it.

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// ++ IMPORTANT CHANGE: CORS Configuration for Deployment ++
// This allows your Vercel frontend to make requests to your Railway backend.
const whitelist = [
    'http://localhost:5500', // For local testing
    'http://127.0.0.1:5500', // For local testing
    'https://ekamperfumes.vercel.app' // **IMPORTANT: Replace this with your actual Vercel URL**
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));
// ++ END OF CHANGE ++

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- REMOVED: Local 'uploads' Directory Logic ---
// The code that created local 'uploads' folders and served them statically has been removed
// because all images will now be handled by Cloudinary.

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully."))
.catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
const offerRoutes = require('./routes/offers');
const productRoutes = require('./routes/productroutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviews');

app.use('/api/offers', offerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// --- Start the server ---
// Adding '0.0.0.0' makes the server accessible from outside its container, which is required by Railway.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running beautifully on port: ${PORT}`);
});