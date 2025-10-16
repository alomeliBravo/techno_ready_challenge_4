/**
 * Restaurant Service
 * Version: 1.2.0
 * 
 * Capa de lógica de negocio para restaurantes.
 * Orquesta operaciones y aplica reglas de negocio.
 */

const restaurantRepository = require('../repositories/restaurantRepository');
const Restaurant = require('../models/Restaurant');
const ApiError = require('../utils/ApiError');

class RestaurantService {
    /**
     * Obtiene todos los restaurantes con paginación
     */
    async getAllRestaurants(page = 1, limit = 20) {
        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

        const result = await restaurantRepository.findAll(validPage, validLimit);

        result.data = result.data.map(doc => Restaurant.fromDatabase(doc));

        return result;
    }

    /**
     * Busca restaurantes por texto (nombre o cocina)
     */
    async searchRestaurants(query, page = 1, limit = 20) {
        if (!query || query.trim().length === 0) {
            throw ApiError.badRequest('Search query is required');
        }

        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

        const result = await restaurantRepository.searchByText(
            query.trim(),
            validPage,
            validLimit
        );

        result.data = result.data.map(doc => Restaurant.fromDatabase(doc));

        return result;
    }

    /**
     * Filtra por cocina
     */
    async filterByCuisine(cuisine, page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc') {
        if (!cuisine || cuisine.trim().length === 0) {
            throw ApiError.badRequest('Cuisine is required');
        }

        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const result = await restaurantRepository.findByCuisine(
            cuisine.trim(),
            validPage,
            validLimit,
            sort
        );

        result.data = result.data.map(doc => Restaurant.fromDatabase(doc));

        return result;
    }

    /**
     * Filtra por municipio (borough)
     */
    async filterByBorough(borough, page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc') {
        if (!borough || borough.trim().length === 0) {
            throw ApiError.badRequest('Borough is required');
        }

        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const result = await restaurantRepository.findByBorough(
            borough.trim(),
            validPage,
            validLimit,
            sort
        );

        result.data = result.data.map(doc => Restaurant.fromDatabase(doc));

        return result;
    }

    /**
     * Filtra por cocina y municipio
     */
    async filterByCuisineAndBorough(cuisine, borough, page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc') {
        if (!cuisine || cuisine.trim().length === 0) {
            throw ApiError.badRequest('Cuisine is required');
        }

        if (!borough || borough.trim().length === 0) {
            throw ApiError.badRequest('Borough is required');
        }

        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const result = await restaurantRepository.findByCuisineAndBorough(
            cuisine.trim(),
            borough.trim(),
            validPage,
            validLimit,
            sort
        );

        result.data = result.data.map(doc => {
            const restaurant = Restaurant.fromDatabase(doc);
            // Agregar promedio de score si hay grades
            if (doc.grades && doc.grades.length > 0) {
                restaurant.averageScore = doc.grades.reduce((sum, g) => sum + g.score, 0) / doc.grades.length;
            }
            return restaurant;
        });

        return result;
    }

    /**
     * Filtra por rango de scores promedio
     */
    async filterByAverageScore(minScore = 0, maxScore = 30, page = 1, limit = 20) {
        const min = Math.max(0, parseInt(minScore));
        const max = Math.min(30, parseInt(maxScore));

        if (min > max) {
            throw ApiError.badRequest('minScore must be less than or equal to maxScore');
        }

        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

        const result = await restaurantRepository.findByAverageScoreRange(
            min,
            max,
            validPage,
            validLimit
        );

        result.data = result.data.map(doc => {
            const restaurant = Restaurant.fromDatabase(doc);
            if (doc.averageScore !== null) {
                restaurant.averageScore = parseFloat(doc.averageScore.toFixed(2));
            }
            return restaurant;
        });

        return result;
    }

    /**
     * Busca restaurantes cercanos (geoespacial)
     */
    async findNearby(longitude, latitude, maxDistance = 5000, page = 1, limit = 20) {
        // Validar coordenadas
        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);

        if (isNaN(lng) || isNaN(lat)) {
            throw ApiError.badRequest('Invalid coordinates');
        }

        if (lng < -180 || lng > 180) {
            throw ApiError.badRequest('Longitude must be between -180 and 180');
        }

        if (lat < -90 || lat > 90) {
            throw ApiError.badRequest('Latitude must be between -90 and 90');
        }

        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));
        const distance = Math.max(1, parseInt(maxDistance));

        const result = await restaurantRepository.findNearby(
            lng,
            lat,
            distance,
            validPage,
            validLimit
        );

        result.data = result.data.map(doc => {
            const restaurant = Restaurant.fromDatabase(doc);
            if (doc.distance) {
                restaurant.distance = parseFloat((doc.distance / 1000).toFixed(2)); // convertir a km
            }
            return restaurant;
        });

        return result;
    }

    /**
     * Obtiene un restaurante por ID
     */
    async getRestaurantById(id) {
        const restaurant = await restaurantRepository.findById(id);

        if (!restaurant) {
            throw ApiError.notFound(`Restaurant with id ${id} not found`);
        }

        return Restaurant.fromDatabase(restaurant);
    }

    /**
     * Obtiene un restaurante por restaurant_id
     */
    async getRestaurantByRestaurantId(restaurantId) {
        const restaurant = await restaurantRepository.findByRestaurantId(restaurantId);

        if (!restaurant) {
            throw ApiError.notFound(`Restaurant with restaurant_id ${restaurantId} not found`);
        }

        return Restaurant.fromDatabase(restaurant);
    }

    /**
     * Crea un nuevo restaurante
     */
    async createRestaurant(restaurantData) {
        try {
            Restaurant.validateRequiredFields(restaurantData);
        } catch (error) {
            throw ApiError.badRequest(error.message);
        }

        if (!restaurantData.restaurant_id) {
            restaurantData.restaurant_id = await restaurantRepository.getNextRestaurantId();
        } else {
            const exists = await restaurantRepository.existsByRestaurantId(restaurantData.restaurant_id);
            if (exists) {
                throw ApiError.conflict(`Restaurant with restaurant_id ${restaurantData.restaurant_id} already exists`);
            }
        }

        const restaurantDoc = Restaurant.toDatabase(restaurantData);

        const created = await restaurantRepository.create(restaurantDoc);

        return Restaurant.fromDatabase(created);
    }

    /**
     * Actualiza un restaurante
     */
    async updateRestaurant(id, updateData) {
        const exists = await restaurantRepository.exists(id);
        if (!exists) {
            throw ApiError.notFound(`Restaurant with id ${id} not found`);
        }

        if (updateData.restaurant_id) {
            const existsRestaurantId = await restaurantRepository.existsByRestaurantId(updateData.restaurant_id);
            if (existsRestaurantId) {
                const current = await restaurantRepository.findById(id);
                if (current.restaurant_id !== updateData.restaurant_id) {
                    throw ApiError.conflict(`Restaurant with restaurant_id ${updateData.restaurant_id} already exists`);
                }
            }
        }

        if (updateData.address) {
            try {
                Restaurant.validateRequiredFields({
                    name: 'temp',
                    cuisine: 'temp',
                    borough: 'temp',
                    address: updateData.address
                });
            } catch (error) {
                throw ApiError.badRequest(error.message);
            }
        }

        const updated = await restaurantRepository.update(id, updateData);

        if (!updated) {
            throw ApiError.notFound(`Restaurant with id ${id} not found`);
        }

        return Restaurant.fromDatabase(updated);
    }

    /**
     * Elimina un restaurante
     */
    async deleteRestaurant(id) {
        const exists = await restaurantRepository.exists(id);
        if (!exists) {
            throw ApiError.notFound(`Restaurant with id ${id} not found`);
        }

        const deleted = await restaurantRepository.delete(id);

        if (!deleted) {
            throw ApiError.internal('Failed to delete restaurant');
        }

        return { message: 'Restaurant deleted successfully' };
    }

    /**
     * Obtiene estadísticas
     */
    async getStatistics() {
        const total = await restaurantRepository.count();

        return {
            totalRestaurants: total
        };
    }
}

module.exports = new RestaurantService();