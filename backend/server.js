const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB then start server
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server up at http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('\n' + '='.repeat(50));
        console.log('ERROR: MongoDB is NOT running.');
        console.log('Please start MongoDB Compass or the MongoDB service.');
        console.log('='.repeat(50) + '\n');
        process.exit(1);
    });
