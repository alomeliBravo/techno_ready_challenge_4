/**
 * Middlewares Index
 * Version: 1.1.0
 * 
 * Exportación centralizada de todos los middlewares.
 */

const { errorHandler, notFoundHandler } = require('./errorHandler');
const { requestLogger } = require('./logger');
const { validateObjectId, validateRestaurant, validatePartialRestaurant } = require('./validation');

module.exports = {
    // Error handling
    errorHandler,
    notFoundHandler,

    // Logging
    requestLogger,

    // Validation
    validateObjectId,
    validateRestaurant,
    validatePartialRestaurant
};