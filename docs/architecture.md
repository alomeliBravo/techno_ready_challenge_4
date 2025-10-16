
## Layer Structure

A Layer architecture organizes a software system into distinct, horizontal layers, each with a specific responsibility, to separate concerns and enhance modularity.

This pattern typically includes a presentation layer, (UI), a business logic layer (Core functions), and a data access layer (database interaction). Layers can only interact with adjacent layers or lower ones, wich improves maintanability, testability, and the ability for different teams to work on separate layers independently.
# Repository Structure

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
