/**
 * Restaurant Repository
 * Version: 1.1.0
 * 
 * Capa de acceso a datos para restaurantes.
 * Responsable de todas las operaciones CRUD con MongoDB.
 */

const { ObjectId } = require('mongodb');
const database = require('../config/database');

class RestaurantRepository {
    constructor() {
        this.collectionName = 'restaurants';
    }

    /**
     * Obtiene la colección de restaurantes
     */
    getCollection() {
        return database.getCollection(this.collectionName);
    }

    /**
     * Encuentra todos los restaurantes con paginación
     */
    async findAll(page = 1, limit = 20) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const [restaurants, total] = await Promise.all([
            collection.find({})
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments()
        ]);

        return {
            data: restaurants,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Encuentra un restaurante por ID (MongoDB _id)
     */
    async findById(id) {
        const collection = this.getCollection();

        if (!ObjectId.isValid(id)) {
            return null;
        }

        return await collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Encuentra un restaurante por restaurant_id
     */
    async findByRestaurantId(restaurantId) {
        const collection = this.getCollection();
        return await collection.findOne({ restaurant_id: parseInt(restaurantId) });
    }

    /**
     * Crea un nuevo restaurante
     */
    async create(restaurantData) {
        const collection = this.getCollection();
        const result = await collection.insertOne(restaurantData);

        return await this.findById(result.insertedId);
    }

    /**
     * Actualiza un restaurante por ID
     */
    async update(id, updateData) {
        const collection = this.getCollection();

        if (!ObjectId.isValid(id)) {
            return null;
        }

        // Remover _id del update si existe
        const { _id, ...dataToUpdate } = updateData;

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: dataToUpdate },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Elimina un restaurante por ID
     */
    async delete(id) {
        const collection = this.getCollection();

        if (!ObjectId.isValid(id)) {
            return null;
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Verifica si existe un restaurant_id
     */
    async existsByRestaurantId(restaurantId) {
        const collection = this.getCollection();
        const count = await collection.countDocuments({
            restaurant_id: parseInt(restaurantId)
        });
        return count > 0;
    }

    /**
     * Obtiene el siguiente restaurant_id disponible
     */
    async getNextRestaurantId() {
        const collection = this.getCollection();
        const maxRestaurant = await collection
            .find({})
            .sort({ restaurant_id: -1 })
            .limit(1)
            .toArray();

        if (maxRestaurant.length === 0) {
            return 1000; // Empezar desde 1000
        }

        return maxRestaurant[0].restaurant_id + 1;
    }

    /**
     * Cuenta el total de restaurantes
     */
    async count() {
        const collection = this.getCollection();
        return await collection.countDocuments();
    }

    /**
     * Verifica si un restaurante existe
     */
    async exists(id) {
        const collection = this.getCollection();

        if (!ObjectId.isValid(id)) {
            return false;
        }

        const count = await collection.countDocuments({ _id: new ObjectId(id) });
        return count > 0;
    }
}

module.exports = new RestaurantRepository();