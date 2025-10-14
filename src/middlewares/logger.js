/**
 * Logger Middleware
 * Version: 1.1.0
 * 
 * Middleware para logging de requests HTTP.
 */

/**
 * Middleware para logging de requests
 */
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;

    // Log del request
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Capturar el tiempo de respuesta
    const startTime = Date.now();

    // Interceptar el final de la respuesta
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        const statusColor = statusCode >= 500 ? '\x1b[31m' : // rojo
            statusCode >= 400 ? '\x1b[33m' : // amarillo
                statusCode >= 300 ? '\x1b[36m' : // cyan
                    '\x1b[32m'; // verde
        const resetColor = '\x1b[0m';

        console.log(
            `[${timestamp}] ${method} ${url} - ${statusColor}${statusCode}${resetColor} - ${duration}ms`
        );
    });

    next();
};

module.exports = {
    requestLogger
};