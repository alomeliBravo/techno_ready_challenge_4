require('dotenv').config();

module.exports = {
    // Server
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'tattler',

    // API
    API_VERSION: process.env.API_VERSION || 'v1',

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

    // Pagination
    DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
    MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE) || 100,

    // Validation
    MAX_COMMENT_LENGTH: parseInt(process.env.MAX_COMMENT_LENGTH) || 500,
    MIN_COMMENT_LENGTH: parseInt(process.env.MIN_COMMENT_LENGTH) || 3,
    MAX_GRADE_SCORE: parseInt(process.env.MAX_GRADE_SCORE) || 30,
    MIN_GRADE_SCORE: parseInt(process.env.MIN_GRADE_SCORE) || 0,
};