/**
 * Restaurant Controller
 * Version: 1.1.0
 * 
 * Controlador para manejo de requests HTTP de restaurantes.
 * Maneja request/response y delega lógica al service.
 */

const restaurantService = require('../services/restaurantService');
const ApiResponse = require('../utils/ApiResponse');

class RestaurantController {
    /**
     * GET /api/v1/restaurants
     * Obtiene todos los restaurantes con paginación
     */
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 20 } = req.query;

            const result = await restaurantService.getAllRestaurants(page, limit);

            res.json(ApiResponse.paginated(result.data, result.pagination));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/:id
     * Obtiene un restaurante por ID
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const restaurant = await restaurantService.getRestaurantById(id);

            res.json(ApiResponse.success(restaurant, 'Restaurant retrieved successfully'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/restaurant-id/:restaurantId
     * Obtiene un restaurante por restaurant_id
     */
    async getByRestaurantId(req, res, next) {
        try {
            const { restaurantId } = req.params;

            const restaurant = await restaurantService.getRestaurantByRestaurantId(restaurantId);

            res.json(ApiResponse.success(restaurant, 'Restaurant retrieved successfully'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/restaurants
     * Crea un nuevo restaurante
     */
    async create(req, res, next) {
        try {
            const restaurantData = req.body;

            const restaurant = await restaurantService.createRestaurant(restaurantData);

            res.status(201).json(ApiResponse.created(restaurant, 'Restaurant created successfully'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/v1/restaurants/:id
     * Actualiza un restaurante completo
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const restaurant = await restaurantService.updateRestaurant(id, updateData);

            res.json(ApiResponse.updated(restaurant, 'Restaurant updated successfully'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/v1/restaurants/:id
     * Actualiza parcialmente un restaurante
     */
    async partialUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const restaurant = await restaurantService.updateRestaurant(id, updateData);

            res.json(ApiResponse.updated(restaurant, 'Restaurant updated successfully'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/v1/restaurants/:id
     * Elimina un restaurante
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            await restaurantService.deleteRestaurant(id);

            res.json(ApiResponse.deleted('Restaurant deleted successfully'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/stats
     * Obtiene estadísticas básicas
     */
    async getStats(req, res, next) {
        try {
            const stats = await restaurantService.getStatistics();

            res.json(ApiResponse.success(stats, 'Statistics retrieved successfully'));
        } catch (error) {   
            next(error);
        }
    }
}

module.exports = new RestaurantController();