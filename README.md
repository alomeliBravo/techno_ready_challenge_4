
## Description (Project Context)

Tattler is a modern restaurant directory application that provides users with personalized culinary experiences based on up-to-date data and personal preferences. Originally a nationwide restaurant directory in Mexico, Tattler has been transformed into a dynamic platform that allows users to discover restaurants, read and add comments, rate establishments, and search through an extensive database of dining options.

The platform uses MongoDB for flexible data management and Express.js for a robust REST API, ensuring that users can interact seamlessly with constantly updated restaurant information.

--- 

## Technologies

- **Node.js:** - JavaScript runtime environment.
- **MongoDB:** - NoSQL database for restaurant data management.
- **Express.js:** - Web framework for building the REST API.
- **MongoDB Native Driver:** - For database operations.

---

## Documentation
For more details about setup, architecture, database structure, and API endpoints, please refer to the following documentation files:

[QUICK SETUP GUIDE](/docs/setupGuide.md)
[DATABASE DOCUMENTATION](/docs/database.md)
[ARCHITECTURE](/docs/architecture.md)
[API ENDPOINTS](/docs/apiEndPoints.md)

---

## Installation

### Preerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager 

---

### Setup Instructions

#### 1. Clone the repository

```bash
git clone <respository-url>
cd tattler-restaurant-directory
```

#### 2.- Install dependencies

```bash
npm install
```

#### 3.- Configure MongoDB connection

Create an '.env' file in the root directory

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=tattler
PORT=3000
```

#### 4.- Generate sample data:

```bash
npm run generate-data
```

#### 5.- Import data to MongoDB

```bash
npm run import-data
```

#### 6.- Start the application

```bash
npm start or npm run dev
```

The API will be available at:

[http://localhost:3000] as default
or
[http://localhost:PORT] the port you specified

### Structure of the repository

```md
tattler-restaurant-directory/
│
├── src/                          # Source code
│   ├── config/                   # Configurations
│   │   ├── database.js           # Connection to MongoDB
│   │   └── environment.js        # Environment Variables
│   │
│   ├── models/                   # Data Models
│   │   └── Restaurant.js         # Restaurant Model
│   │
│   ├── repositories/             # Data Access Layer
│   │   └── restaurantRepository.js
│   │
│   ├── services/                 # Bussiness Logic
│   │   └── restaurantService.js
│   │
│   ├── controllers/              # API Controllers
│   │   └── restaurantController.js
│   │
│   ├── routes/                   # Routes definitions
│   │   ├── restaurantRoutes.js
│   │   └── index.js
│   │
│   ├── middlewares/              # Middlewares
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── validation.js
│   │   └── index.js
│   │
│   ├── utils/                    # Utilities
│   │   ├── ApiError.js
│   │   └── ApiResponse.js
│   │
│   └── server.js                 # Express configuration and server entry point.
│
├── scripts/                      # Utility Scripts
│   ├── generateData.js           # Random Data Generator
│   ├── importData.js             # MongoDB data importer
│   ├── createIndexes.js          # Index creators
│   └── backup.js                 # Backup System
│
├── data/                         # Generated data
│   ├── restaurants.csv           # Data on CSV format
│   ├── restaurants.json          # Data on Json format
│   └── backups/                  # Database backups
│
├── docs/                         # Documentation
│   ├── screenshots/              # Screenshots
│   └── ARCHITECTURE.md           # Architecture documentation
│   └──API_DOCUMENTATION.md          # API Documentation
│
├── .env                          # Environment variables (not included in repo)
├── .env.example                  # Environment variables template
├── .gitignore                    
│
├── CHANGELOG.md                  # Version history
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Dependencies lock
└── README.md
```