/**
 * Restaurant Repository
 * Version: 1.2.0
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
     * Encuentra restaurantes con filtros y ordenamiento
     */
    async findWithFilters(filters = {}, page = 1, limit = 20, sort = {}) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const [restaurants, total] = await Promise.all([
            collection.find(filters)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(filters)
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
     * Busca por texto (nombre o cocina)
     */
    async searchByText(query, page = 1, limit = 20) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const filter = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { cuisine: { $regex: query, $options: 'i' } }
            ]
        };

        const [restaurants, total] = await Promise.all([
            collection.find(filter)
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(filter)
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
     * Filtra por cocina
     */
    async findByCuisine(cuisine, page = 1, limit = 20, sort = { name: 1 }) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const filter = { cuisine: { $regex: cuisine, $options: 'i' } };

        const [restaurants, total] = await Promise.all([
            collection.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(filter)
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
     * Filtra por municipio (borough)
     */
    async findByBorough(borough, page = 1, limit = 20, sort = { name: 1 }) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const filter = { borough: { $regex: borough, $options: 'i' } };

        const [restaurants, total] = await Promise.all([
            collection.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(filter)
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
     * Filtra por cocina y municipio
     */
    async findByCuisineAndBorough(cuisine, borough, page = 1, limit = 20, sort = { name: 1 }) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const filter = {
            cuisine: { $regex: cuisine, $options: 'i' },
            borough: { $regex: borough, $options: 'i' }
        };

        const [restaurants, total] = await Promise.all([
            collection.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(filter)
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
     * Calcula promedio de scores para restaurante
     */
    async getAverageScore(restaurantId) {
        const collection = this.getCollection();

        if (!ObjectId.isValid(restaurantId)) {
            return null;
        }

        const result = await collection.aggregate([
            { $match: { _id: new ObjectId(restaurantId) } },
            {
                $addFields: {
                    averageScore: {
                        $cond: [
                            { $eq: [{ $size: '$grades' }, 0] },
                            null,
                            { $avg: '$grades.score' }
                        ]
                    }
                }
            },
            { $project: { averageScore: 1 } }
        ]).toArray();

        return result.length > 0 ? result[0].averageScore : null;
    }

    /**
     * Filtra por rango de scores promedio
     */
    async findByAverageScoreRange(minScore, maxScore, page = 1, limit = 20) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $addFields: {
                    averageScore: {
                        $cond: [
                            { $eq: [{ $size: '$grades' }, 0] },
                            null,
                            { $avg: '$grades.score' }
                        ]
                    }
                }
            },
            {
                $match: {
                    averageScore: {
                        $gte: minScore,
                        $lte: maxScore
                    }
                }
            },
            { $sort: { averageScore: 1 } },
            { $skip: skip },
            { $limit: limit }
        ];

        const [restaurants, totalResult] = await Promise.all([
            collection.aggregate(pipeline).toArray(),
            collection.aggregate([
                {
                    $addFields: {
                        averageScore: {
                            $cond: [
                                { $eq: [{ $size: '$grades' }, 0] },
                                null,
                                { $avg: '$grades.score' }
                            ]
                        }
                    }
                },
                {
                    $match: {
                        averageScore: {
                            $gte: minScore,
                            $lte: maxScore
                        }
                    }
                },
                { $count: 'total' }
            ]).toArray()
        ]);

        const total = totalResult.length > 0 ? totalResult[0].total : 0;

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
     * Busca geoespacial (restaurantes cercanos)
     */
    async findNearby(longitude, latitude, maxDistance = 5000, page = 1, limit = 20) {
        const collection = this.getCollection();
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [longitude, latitude] },
                    distanceField: 'distance',
                    maxDistance: maxDistance,
                    spherical: true
                }
            },
            { $skip: skip },
            { $limit: limit }
        ];

        const [restaurants, totalResult] = await Promise.all([
            collection.aggregate(pipeline).toArray(),
            collection.aggregate([
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [longitude, latitude] },
                        distanceField: 'distance',
                        maxDistance: maxDistance,
                        spherical: true
                    }
                },
                { $count: 'total' }
            ]).toArray()
        ]);

        const total = totalResult.length > 0 ? totalResult[0].total : 0;

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
            return 1000;
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