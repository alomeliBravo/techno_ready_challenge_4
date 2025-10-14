/**
 * Tattler Restaurant Directory API Server
 * Version: 1.1.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFoundHandler, requestLogger } = require('./middlewares');
const { PORT, NODE_ENV } = require('./config/environment');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ==========================================
// ROUTES
// ==========================================

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Tattler Restaurant Directory API',
        version: '1.1.0',
        documentation: '/api/v1',
        endpoints: {
            health: '/health',
            api: '/api/v1'
        }
    });
});

app.use('/api/v1', routes);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// SERVER INITIALIZATION
// ==========================================

async function startServer() {
    try {
        // Connect to database
        await database.connect();

        // Start server
        const server = app.listen(PORT, () => {
            console.log(`Tattler API v1.1.0 running on http://localhost:${PORT} [${NODE_ENV}]`);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received, closing server...`);
            server.close(async () => {
                await database.close();
                process.exit(0);
            });
            setTimeout(() => process.exit(1), 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (error) => {
            console.error('Unhandled Rejection:', error);
            server.close(() => process.exit(1));
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;