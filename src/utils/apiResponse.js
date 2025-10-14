/**
 * Clase para estandarizar respuestas de la API
 */
class ApiResponse {
    /**
     * Respuesta exitosa
     */
    static success(data, message = 'Success', meta = null) {
        const response = {
            success: true,
            message,
            data
        };

        if (meta) {
            response.meta = meta;
        }

        return response;
    }

    /**
     * Respuesta de creación exitosa
     */
    static created(data, message = 'Resource created successfully') {
        return {
            success: true,
            message,
            data
        };
    }

    /**
     * Respuesta de actualización exitosa
     */
    static updated(data, message = 'Resource updated successfully') {
        return {
            success: true,
            message,
            data
        };
    }

    /**
     * Respuesta de eliminación exitosa
     */
    static deleted(message = 'Resource deleted successfully') {
        return {
            success: true,
            message
        };
    }

    /**
     * Respuesta con paginación
     */
    static paginated(data, pagination) {
        return {
            success: true,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                totalPages: Math.ceil(pagination.total / pagination.limit),
                hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
                hasPrev: pagination.page > 1
            }
        };
    }

    /**
     * Respuesta de error
     */
    static error(message, errors = null, statusCode = 500) {
        const response = {
            success: false,
            message,
            statusCode
        };

        if (errors) {
            response.errors = errors;
        }

        return response;
    }
}

module.exports = ApiResponse;