/**
 * Restaurant Routes
 * Version: 1.2.0
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
 * @route   GET /api/v1/restaurants/search
 * @desc    Buscar por texto (nombre o cocina)
 * @access  Public
 * @query   q - Texto a buscar
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20)
 */
router.get('/search', restaurantController.search);

/**
 * @route   GET /api/v1/restaurants/by-cuisine
 * @desc    Filtrar por tipo de cocina
 * @access  Public
 * @query   cuisine - Tipo de cocina (requerido)
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20)
 * @query   sort - Campo para ordenar (default: name)
 * @query   order - Orden: asc o desc (default: asc)
 */
router.get('/by-cuisine', restaurantController.filterByCuisine);

/**
 * @route   GET /api/v1/restaurants/by-borough
 * @desc    Filtrar por municipio
 * @access  Public
 * @query   borough - Municipio (requerido)
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20)
 * @query   sort - Campo para ordenar (default: name)
 * @query   order - Orden: asc o desc (default: asc)
 */
router.get('/by-borough', restaurantController.filterByBorough);

/**
 * @route   GET /api/v1/restaurants/filter
 * @desc    Filtrar por cocina y municipio
 * @access  Public
 * @query   cuisine - Tipo de cocina (requerido)
 * @query   borough - Municipio (requerido)
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20)
 * @query   sort - Campo para ordenar (default: name)
 * @query   order - Orden: asc o desc (default: asc)
 */
router.get('/filter', restaurantController.filter);

/**
 * @route   GET /api/v1/restaurants/by-rating
 * @desc    Filtrar por rango de scores promedio
 * @access  Public
 * @query   minScore - Puntuación mínima (default: 0)
 * @query   maxScore - Puntuación máxima (default: 30)
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20)
 */
router.get('/by-rating', restaurantController.filterByRating);

/**
 * @route   GET /api/v1/restaurants/nearby
 * @desc    Buscar restaurantes cercanos (geoespacial)
 * @access  Public
 * @query   lng - Longitud (requerido)
 * @query   lat - Latitud (requerido)
 * @query   radius - Radio en metros (default: 5000)
 * @query   page - Número de página (default: 1)
 * @query   limit - Límite por página (default: 20)
 */
router.get('/nearby', restaurantController.nearby);

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