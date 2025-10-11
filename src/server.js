const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Tattler Restaurant Directory API'
    });
});

// API Routes - Will be implemented in Sprint 2
// app.use('/api/restaurants', require('./routes/restaurants'));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Tattler Restaurant Directory API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            restaurants: '/api/restaurants (Coming in Sprint 2)'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`

Tattler Restaurant Directory API
Server running on port ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
http://localhost:${PORT}

  `);
});

module.exports = app;