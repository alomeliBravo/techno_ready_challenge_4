/**
 * Validation Middleware
 * Version: 1.1.0
 * 
 * Middlewares para validación de datos de entrada.
 */

const { ObjectId } = require('mongodb');
const ApiError = require('../utils/apiError');

/**
 * Valida que el ID sea un ObjectId válido de MongoDB
 */
const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return next(ApiError.badRequest('Invalid ID format. Must be a valid MongoDB ObjectId'));
    }

    next();
};

/**
 * Valida los datos completos de un restaurante
 */
const validateRestaurant = (req, res, next) => {
    const { name, cuisine, borough, address } = req.body;
    const errors = [];

    // Validar campos requeridos
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('name is required and must be a non-empty string');
    }

    if (!cuisine || typeof cuisine !== 'string' || cuisine.trim().length === 0) {
        errors.push('cuisine is required and must be a non-empty string');
    }

    if (!borough || typeof borough !== 'string' || borough.trim().length === 0) {
        errors.push('borough is required and must be a non-empty string');
    }

    if (!address) {
        errors.push('address is required');
    } else {
        // Validar estructura de address
        if (!address.building || typeof address.building !== 'string') {
            errors.push('address.building is required and must be a string');
        }

        if (!address.street || typeof address.street !== 'string') {
            errors.push('address.street is required and must be a string');
        }

        if (!address.zipcode || typeof address.zipcode !== 'string') {
            errors.push('address.zipcode is required and must be a string');
        }

        if (!address.coord || !Array.isArray(address.coord)) {
            errors.push('address.coord is required and must be an array');
        } else {
            if (address.coord.length !== 2) {
                errors.push('address.coord must have exactly 2 elements [longitude, latitude]');
            }

            if (typeof address.coord[0] !== 'number' || typeof address.coord[1] !== 'number') {
                errors.push('address.coord must contain numbers [longitude, latitude]');
            }

            // Validar rangos de coordenadas
            const [lng, lat] = address.coord;
            if (lng < -180 || lng > 180) {
                errors.push('longitude must be between -180 and 180');
            }
            if (lat < -90 || lat > 90) {
                errors.push('latitude must be between -90 and 90');
            }
        }
    }

    // Validar restaurant_id si se proporciona
    if (req.body.restaurant_id !== undefined) {
        if (!Number.isInteger(req.body.restaurant_id) || req.body.restaurant_id < 0) {
            errors.push('restaurant_id must be a positive integer');
        }
    }

    // Validar grades si se proporciona
    if (req.body.grades !== undefined) {
        if (!Array.isArray(req.body.grades)) {
            errors.push('grades must be an array');
        } else {
            req.body.grades.forEach((grade, index) => {
                if (!grade.date) {
                    errors.push(`grades[${index}].date is required`);
                }
                if (grade.score === undefined || !Number.isInteger(grade.score)) {
                    errors.push(`grades[${index}].score must be an integer`);
                }
            });
        }
    }

    // Validar comments si se proporciona
    if (req.body.comments !== undefined) {
        if (!Array.isArray(req.body.comments)) {
            errors.push('comments must be an array');
        } else {
            req.body.comments.forEach((comment, index) => {
                if (!comment.comment || typeof comment.comment !== 'string') {
                    errors.push(`comments[${index}].comment is required and must be a string`);
                }
                if (!comment.date) {
                    errors.push(`comments[${index}].date is required`);
                }
            });
        }
    }

    if (errors.length > 0) {
        return next(ApiError.validationError('Validation failed', errors));
    }

    next();
};

/**
 * Valida datos parciales de un restaurante (para PATCH)
 */
const validatePartialRestaurant = (req, res, next) => {
    const errors = [];
    const body = req.body;

    // Si no hay datos, error
    if (Object.keys(body).length === 0) {
        return next(ApiError.badRequest('Request body cannot be empty'));
    }

    // Validar campos si están presentes
    if (body.name !== undefined) {
        if (typeof body.name !== 'string' || body.name.trim().length === 0) {
            errors.push('name must be a non-empty string');
        }
    }

    if (body.cuisine !== undefined) {
        if (typeof body.cuisine !== 'string' || body.cuisine.trim().length === 0) {
            errors.push('cuisine must be a non-empty string');
        }
    }

    if (body.borough !== undefined) {
        if (typeof body.borough !== 'string' || body.borough.trim().length === 0) {
            errors.push('borough must be a non-empty string');
        }
    }

    if (body.address !== undefined) {
        if (body.address.building !== undefined && typeof body.address.building !== 'string') {
            errors.push('address.building must be a string');
        }

        if (body.address.street !== undefined && typeof body.address.street !== 'string') {
            errors.push('address.street must be a string');
        }

        if (body.address.zipcode !== undefined && typeof body.address.zipcode !== 'string') {
            errors.push('address.zipcode must be a string');
        }

        if (body.address.coord !== undefined) {
            if (!Array.isArray(body.address.coord) || body.address.coord.length !== 2) {
                errors.push('address.coord must be an array of 2 numbers [longitude, latitude]');
            } else {
                const [lng, lat] = body.address.coord;
                if (typeof lng !== 'number' || typeof lat !== 'number') {
                    errors.push('address.coord must contain numbers');
                }
                if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
                    errors.push('invalid coordinate values');
                }
            }
        }
    }

    if (body.restaurant_id !== undefined) {
        if (!Number.isInteger(body.restaurant_id) || body.restaurant_id < 0) {
            errors.push('restaurant_id must be a positive integer');
        }
    }

    if (errors.length > 0) {
        return next(ApiError.validationError('Validation failed', errors));
    }

    next();
};

module.exports = {
    validateObjectId,
    validateRestaurant,
    validatePartialRestaurant
};