const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'tattler';

async function createBackup() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('Starting backup process...');
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✓ Connected to MongoDB');

        const db = client.db(DB_NAME);

        // Create backup directory if it doesn't exist
        const backupDir = './data/backups';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Generate timestamp for backup filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `tattler_backup_${timestamp}.json`);

        // Get all collections
        const collections = await db.listCollections().toArray();
        const backupData = {
            database: DB_NAME,
            timestamp: new Date().toISOString(),
            collections: {}
        };

        console.log(`\nBacking up ${collections.length} collection(s)...`);

        // Backup each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`  Backing up collection: ${collectionName}`);

            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();

            backupData.collections[collectionName] = {
                count: documents.length,
                documents: documents
            };

            console.log(`  ✓ ${documents.length} documents backed up`);
        }

        // Write backup to file
        console.log('\nWriting backup to file...');
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

        // Get file size
        const stats = fs.statSync(backupPath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

        console.log('\n✓ Backup completed successfully!');
        console.log(`  File: ${backupPath}`);
        console.log(`  Size: ${fileSizeInMB} MB`);

        // Create a compressed version (optional)
        const compressedPath = path.join(backupDir, `tattler_backup_${timestamp}_compact.json`);
        fs.writeFileSync(compressedPath, JSON.stringify(backupData));
        const compressedStats = fs.statSync(compressedPath);
        const compressedSizeInMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
        console.log(`  Compressed: ${compressedPath}`);
        console.log(`  Compressed Size: ${compressedSizeInMB} MB`);

        // Summary
        console.log('\n--- Backup Summary ---');
        for (const [collectionName, data] of Object.entries(backupData.collections)) {
            console.log(`  ${collectionName}: ${data.count} documents`);
        }

        // List all backups
        console.log('\n--- Available Backups ---');
        const backupFiles = fs.readdirSync(backupDir)
            .filter(file => file.startsWith('tattler_backup_') && file.endsWith('.json'))
            .sort()
            .reverse();

        backupFiles.slice(0, 5).forEach((file, index) => {
            const filePath = path.join(backupDir, file);
            const fileStats = fs.statSync(filePath);
            const sizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
            console.log(`  ${index + 1}. ${file} (${sizeMB} MB)`);
        });

        if (backupFiles.length > 5) {
            console.log(`  ... and ${backupFiles.length - 5} more`);
        }

    } catch (error) {
        console.error('Error creating backup:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n✓ Database connection closed');
    }
}

// Run backup
createBackup();