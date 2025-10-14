const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { NODE_ENV } = require('../config/environment');

/**
 * Manejador de errores de MongoDB
 */
const handleMongoError = (error) => {
    // Duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return ApiError.conflict(`${field} already exists`);
    }

    // Cast error (Invalid ObjectId)
    if (error.name === 'BSONError' || error.name === 'CastError') {
        return ApiError.badRequest('Invalid ID format');
    }

    return error;
};

/**
 * Middleware de manejo de errores global
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Convertir errores de MongoDB a ApiError
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        error = handleMongoError(err);
    }

    // Si no es un ApiError, convertirlo
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(message, statusCode);
    }

    // Log del error en desarrollo
    if (NODE_ENV === 'development') {
        console.error('Error:', {
            message: error.message,
            statusCode: error.statusCode,
            stack: error.stack,
            errors: error.errors
        });
    }

    // Responder con el error
    res.status(error.statusCode).json(
        ApiResponse.error(error.message, error.errors, error.statusCode)
    );
};

/**
 * Middleware para rutas no encontradas (404)
 */
const notFoundHandler = (req, res, next) => {
    const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
    next(error);
};

module.exports = {
    errorHandler,
    notFoundHandler
};