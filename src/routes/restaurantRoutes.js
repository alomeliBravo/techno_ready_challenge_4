/**
 * Restaurant Routes
 * Version: 1.1.0
 * 
 * Define todas las rutas para el recurso de restaurantes.
 */

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { validateRestaurant, validateObjectId, validatePartialRestaurant } = require('../middlewares/validation');

/**
 * @route   GET /api/v1/restaurants/stats
 * @desc    Obtener estadísticas básicas
 * @access  Public
 */
router.get('/stats', restaurantController.getStats);

/**
 * @route   GET /api/v1/restaurants/restaurant-id/:restaurantId
 * @desc    Obtener restaurante por restaurant_id
 * @access  Public
 */
router.get('/restaurant-id/:restaurantId', restaurantController.getByRestaurantId);

/**
 * @route   GET /api/v1/restaurants
 * @desc    Obtener todos los restaurantes (con paginación)
 * @access  Public
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20, max: 100)
 */
router.get('/', restaurantController.getAll);

/**
 * @route   GET /api/v1/restaurants/:id
 * @desc    Obtener un restaurante por ID
 * @access  Public
 */
router.get('/:id', validateObjectId, restaurantController.getById);

/**
 * @route   POST /api/v1/restaurants
 * @desc    Crear un nuevo restaurante
 * @access  Public
 */
router.post('/', validateRestaurant, restaurantController.create);

/**
 * @route   PUT /api/v1/restaurants/:id
 * @desc    Actualizar un restaurante completo
 * @access  Public
 */
router.put('/:id', validateObjectId, validateRestaurant, restaurantController.update);

/**
 * @route   PATCH /api/v1/restaurants/:id
 * @desc    Actualizar parcialmente un restaurante
 * @access  Public
 */
router.patch('/:id', validateObjectId, validatePartialRestaurant, restaurantController.partialUpdate);

/**
 * @route   DELETE /api/v1/restaurants/:id
 * @desc    Eliminar un restaurante
 * @access  Public
 */
router.delete('/:id', validateObjectId, restaurantController.delete);

module.exports = router;