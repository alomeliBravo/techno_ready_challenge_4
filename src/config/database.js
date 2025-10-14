const { MongoClient } = require('mongodb');
const { MONGODB_URI, DB_NAME } = require('./environment');

class Database {
    constructor() {
        this.client = null;
        this.db = null;
    }

    /**
     * Conectar a MongoDB
     */
    async connect() {
        try {
            if (this.client && this.db) {
                console.log('⚠️  Database already connected');
                return this.db;
            }

            // Opciones de conexión
            const options = {
                maxPoolSize: 10,
                minPoolSize: 5,
                maxIdleTimeMS: 30000,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            // Crear cliente
            this.client = new MongoClient(MONGODB_URI, options);

            // Conectar
            await this.client.connect();

            // Obtener instancia de base de datos
            this.db = this.client.db(DB_NAME);

            // Verificar conexión
            await this.db.command({ ping: 1 });

            console.log(`✓ Connected to database: ${DB_NAME}`);

            return this.db;
        } catch (error) {
            console.error('❌ Database connection error:', error);
            throw error;
        }
    }

    /**
     * Obtener instancia de base de datos
     */
    getDb() {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db;
    }

    /**
     * Obtener una colección específica
     */
    getCollection(collectionName) {
        return this.getDb().collection(collectionName);
    }

    /**
     * Cerrar conexión
     */
    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            console.log('✓ Database connection closed');
        }
    }

    /**
     * Verificar estado de conexión
     */
    isConnected() {
        return this.client !== null && this.db !== null;
    }
}

// Exportar instancia única (Singleton)
module.exports = new Database();