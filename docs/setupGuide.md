## Installation

### Preerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

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