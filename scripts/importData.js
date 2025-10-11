const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'tattler';

async function importData() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✓ Connected to MongoDB');

        const db = client.db(DB_NAME);
        const collection = db.collection('restaurants');

        // Read JSON data
        console.log('Reading restaurant data...');
        const dataPath = './data/restaurants.json';

        if (!fs.existsSync(dataPath)) {
            throw new Error('Data file not found. Please run "npm run generate-data" first.');
        }

        const jsonData = fs.readFileSync(dataPath, 'utf8');
        const restaurants = JSON.parse(jsonData);

        // Transform data for MongoDB
        const transformedRestaurants = restaurants.map(restaurant => {
            // Convert string ObjectIds to actual ObjectId objects
            const transformed = {
                ...restaurant,
                _id: new ObjectId(restaurant._id),
                comments: restaurant.comments.map(comment => ({
                    ...comment,
                    _id: new ObjectId(comment._id),
                    date: new Date(comment.date)
                })),
                grades: restaurant.grades.map(grade => ({
                    ...grade,
                    date: new Date(grade.date)
                }))
            };

            return transformed;
        });

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('Clearing existing data...');
        await collection.deleteMany({});

        // Insert data
        console.log('Importing restaurant data...');
        const result = await collection.insertMany(transformedRestaurants);

        console.log(`✓ Successfully imported ${result.insertedCount} restaurants`);

        // Verify import
        const count = await collection.countDocuments();
        console.log(`✓ Total documents in collection: ${count}`);

        // Show sample document
        const sample = await collection.findOne();
        console.log('\nSample restaurant document:');
        console.log(JSON.stringify(sample, null, 2));

    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n✓ Database connection closed');
    }
}

// Run import
importData();