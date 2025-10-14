/**
 * Routes Index
 * Version: 1.1.0
 * 
 * Punto central para todas las rutas de la API v1.
 */

const express = require('express');
const router = express.Router();
const restaurantRoutes = require('./restaurantRoutes');

// Información de la API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Tattler Restaurant Directory API v1',
        version: '1.1.0',
        endpoints: {
            restaurants: '/api/v1/restaurants',
            stats: '/api/v1/restaurants/stats',
            health: '/health'
        },
        documentation: 'See README.md for full API documentation'
    });
});

// Rutas de recursos
router.use('/restaurants', restaurantRoutes);

module.exports = router;