/**
 * Restaurant Controller
 * Version: 1.2.0
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
     * GET /api/v1/restaurants/search
     * Busca restaurantes por texto
     */
    async search(req, res, next) {
        try {
            const { q, page = 1, limit = 20 } = req.query;

            const result = await restaurantService.searchRestaurants(q, page, limit);

            res.json(ApiResponse.paginated(result.data, result.pagination));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/by-cuisine
     * Filtra por tipo de cocina
     */
    async filterByCuisine(req, res, next) {
        try {
            const { cuisine, page = 1, limit = 20, sort = 'name', order = 'asc' } = req.query;

            const result = await restaurantService.filterByCuisine(cuisine, page, limit, sort, order);

            res.json(ApiResponse.paginated(result.data, result.pagination));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/by-borough
     * Filtra por municipio
     */
    async filterByBorough(req, res, next) {
        try {
            const { borough, page = 1, limit = 20, sort = 'name', order = 'asc' } = req.query;

            const result = await restaurantService.filterByBorough(borough, page, limit, sort, order);

            res.json(ApiResponse.paginated(result.data, result.pagination));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/filter
     * Filtra por cocina y municipio
     */
    async filter(req, res, next) {
        try {
            const { cuisine, borough, page = 1, limit = 20, sort = 'name', order = 'asc' } = req.query;

            const result = await restaurantService.filterByCuisineAndBorough(
                cuisine,
                borough,
                page,
                limit,
                sort,
                order
            );

            res.json(ApiResponse.paginated(result.data, result.pagination));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/by-rating
     * Filtra por rango de scores promedio
     */
    async filterByRating(req, res, next) {
        try {
            const { minScore = 0, maxScore = 30, page = 1, limit = 20 } = req.query;

            const result = await restaurantService.filterByAverageScore(minScore, maxScore, page, limit);

            res.json(ApiResponse.paginated(result.data, result.pagination));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/restaurants/nearby
     * Busca restaurantes cercanos
     */
    async nearby(req, res, next) {
        try {
            const { lng, lat, radius = 5000, page = 1, limit = 20 } = req.query;

            const result = await restaurantService.findNearby(lng, lat, radius, page, limit);

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