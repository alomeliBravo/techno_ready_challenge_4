const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'tattler';

async function createIndexes() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✓ Connected to MongoDB');

        const db = client.db(DB_NAME);
        const collection = db.collection('restaurants');

        console.log('\nCreating indexes...');

        // Index 1: Restaurant name (for text search)
        await collection.createIndex(
            { name: 1 },
            { name: 'idx_restaurant_name' }
        );
        console.log('✓ Created index on: name');

        // Index 2: Cuisine type (for filtering by cuisine)
        await collection.createIndex(
            { cuisine: 1 },
            { name: 'idx_cuisine' }
        );
        console.log('✓ Created index on: cuisine');

        // Index 3: Borough (for location-based queries)
        await collection.createIndex(
            { borough: 1 },
            { name: 'idx_borough' }
        );
        console.log('✓ Created index on: borough');

        // Index 4: Restaurant ID (for unique identification)
        await collection.createIndex(
            { restaurant_id: 1 },
            { name: 'idx_restaurant_id', unique: true }
        );
        console.log('✓ Created unique index on: restaurant_id');

        // Index 5: Geospatial index for coordinates (2dsphere for location queries)
        await collection.createIndex(
            { 'address.coord': '2dsphere' },
            { name: 'idx_coordinates' }
        );
        console.log('✓ Created 2dsphere index on: address.coord');

        // Index 6: Compound index for cuisine and borough (common filter combination)
        await collection.createIndex(
            { cuisine: 1, borough: 1 },
            { name: 'idx_cuisine_borough' }
        );
        console.log('✓ Created compound index on: cuisine + borough');

        // Index 7: Text index for full-text search on name and cuisine
        await collection.createIndex(
            { name: 'text', cuisine: 'text' },
            { name: 'idx_text_search' }
        );
        console.log('✓ Created text index on: name + cuisine');

        // List all indexes
        console.log('\n--- All Indexes ---');
        const indexes = await collection.indexes();
        indexes.forEach((index, i) => {
            console.log(`\n${i + 1}. ${index.name}`);
            console.log(`   Keys:`, index.key);
            if (index.unique) console.log(`   Unique: true`);
            if (index['2dsphereIndexVersion']) console.log(`   Type: 2dsphere`);
        });

        console.log('\n✓ All indexes created successfully!');

    } catch (error) {
        console.error('Error creating indexes:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n✓ Database connection closed');
    }
}

// Run index creation
createIndexes();