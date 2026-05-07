const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize Environment Variables
dotenv.config();

const app = express();

// Standard Middleware
app.use(express.json()); // Parses incoming JSON body payloads
app.use(cors()); // Prevents CORS errors when connecting from a frontend on a different port/domain

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Database Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Mount API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/results', require('./routes/results'));

// Global Error Handler Fallback
app.use((err, req, res, next) => {
    res.status(500).json({ message: 'An unexpected backend error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));