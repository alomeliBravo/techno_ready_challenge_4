Tattler - Restaurant Directory Platform
Description
Tattler is a modern restaurant directory application that provides users with personalized culinary experiences based on up-to-date data and personal preferences. Originally a nationwide restaurant directory in Mexico, Tattler has been transformed into a dynamic platform that allows users to discover restaurants, read and add comments, rate establishments, and search through an extensive database of dining options.

The platform uses MongoDB for flexible data management and Express.js for a robust REST API, ensuring that users can interact seamlessly with constantly updated restaurant information.

Technologies
Node.js - JavaScript runtime environment
MongoDB - NoSQL database for restaurant data management
Express.js - Web framework for building the REST API
MongoDB Native Driver - For database operations
Installation
Prerequisites
Node.js (v14 or higher)
MongoDB (v4.4 or higher)
npm or yarn package manager
Setup Instructions
Clone the repository
bash
   git clone <repository-url>
   cd tattler-restaurant-directory
Install dependencies
bash
   npm install
Configure MongoDB connection Create a .env file in the root directory:
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=tattler
   PORT=3000
Generate sample data
bash
   npm run generate-data
Import data to MongoDB
bash
   npm run import-data
Start the application
bash
   npm start
Usage
Database Operations
Generate CSV data: npm run generate-data
Import data to MongoDB: npm run import-data
Create database backup: npm run backup
Create indexes: npm run create-indexes
API Server
Start the Express.js server:

bash
npm start
The API will be available at http://localhost:3000

Repository Structure
TECHNO_READY_CHALLENGE_4/
│
├── scripts/
│   ├── generateData.js          # Generates CSV with 100+ restaurant records
│   ├── importData.js             # Imports CSV data into MongoDB
│   ├── createIndexes.js          # Creates database indexes for performance
│   └── backup.js                 # Creates database backup
│
├── src/
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── routes/
│   │   └── restaurants.js        # API routes (Sprint 2)
│   ├── controllers/
│   │   └── restaurantController.js # Business logic (Sprint 2)
│   └── app.js                    # Express application setup
│
├── data/
│   ├── restaurants.csv           # Generated restaurant data
│   └── backups/                  # Database backups folder
│
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
└── README.md                     # Project documentation
Database Schema
Each restaurant document contains:

_id: Unique MongoDB ObjectId
name: Restaurant name
cuisine: Type of cuisine
borough: Geographic location
address: Complete address with coordinates
restaurant_id: Unique restaurant identifier
grades: Array of inspection scores with dates
comments: Array of user comments with timestamps
Features
Current (Sprint 1)
Automated data generation
CSV to MongoDB import
Database indexing for optimized queries
Automated backup system
Upcoming (Sprint 2)
REST API endpoints for CRUD operations
Search and filter functionality
User comment system
Restaurant rating system
Personalized recommendations
Contributing
This project is part of Tattler's transformation initiative. For questions or contributions, please contact the development team.

