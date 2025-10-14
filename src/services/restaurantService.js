/**
 * Restaurant Service
 * Version: 1.1.0
 * 
 * Capa de lógica de negocio para restaurantes.
 * Orquesta operaciones y aplica reglas de negocio.
 */

const restaurantRepository = require('../repositories/restaurantRepository');
const Restaurant = require('../models/Restaurant');
const ApiError = require('../utils/apiError');

class RestaurantService {
    /**
     * Obtiene todos los restaurantes con paginación
     */
    async getAllRestaurants(page = 1, limit = 20) {
        // Validar parámetros
        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

        const result = await restaurantRepository.findAll(validPage, validLimit);

        // Transformar documentos
        result.data = result.data.map(doc => Restaurant.fromDatabase(doc));

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
        // Validar campos requeridos
        try {
            Restaurant.validateRequiredFields(restaurantData);
        } catch (error) {
            throw ApiError.badRequest(error.message);
        }

        // Generar restaurant_id si no existe
        if (!restaurantData.restaurant_id) {
            restaurantData.restaurant_id = await restaurantRepository.getNextRestaurantId();
        } else {
            // Verificar que el restaurant_id no exista
            const exists = await restaurantRepository.existsByRestaurantId(restaurantData.restaurant_id);
            if (exists) {
                throw ApiError.conflict(`Restaurant with restaurant_id ${restaurantData.restaurant_id} already exists`);
            }
        }

        // Preparar documento para base de datos
        const restaurantDoc = Restaurant.toDatabase(restaurantData);

        // Crear restaurante
        const created = await restaurantRepository.create(restaurantDoc);

        return Restaurant.fromDatabase(created);
    }

    /**
     * Actualiza un restaurante
     */
    async updateRestaurant(id, updateData) {
        // Verificar que el restaurante existe
        const exists = await restaurantRepository.exists(id);
        if (!exists) {
            throw ApiError.notFound(`Restaurant with id ${id} not found`);
        }

        // Si se intenta actualizar restaurant_id, verificar que no exista
        if (updateData.restaurant_id) {
            const existsRestaurantId = await restaurantRepository.existsByRestaurantId(updateData.restaurant_id);
            if (existsRestaurantId) {
                // Verificar que no sea el mismo restaurante
                const current = await restaurantRepository.findById(id);
                if (current.restaurant_id !== updateData.restaurant_id) {
                    throw ApiError.conflict(`Restaurant with restaurant_id ${updateData.restaurant_id} already exists`);
                }
            }
        }

        // Validar estructura si se actualiza address
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

        // Actualizar
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
        // Verificar que existe
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
     * Obtiene estadísticas básicas
     */
    async getStatistics() {
        const total = await restaurantRepository.count();

        return {
            totalRestaurants: total
        };
    }
}

module.exports = new RestaurantService();