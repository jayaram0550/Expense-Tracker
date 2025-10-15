require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added for serving static files later (optional for now)

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all origins (for development)

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Optional: Serve static frontend assets in production (uncomment later if deploying together)
/*
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}
*/

// Basic route for testing development environment
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
