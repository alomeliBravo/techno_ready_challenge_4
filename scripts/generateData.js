const fs = require('fs');
const { ObjectId } = require('mongodb');

// Arrays for randomization
const restaurantNames = [
    'La Taquería', 'El Fogón', 'Casa Grande', 'Los Arcos', 'La Parilla',
    'El Rincón', 'La Terraza', 'Don Pedro', 'El Sazón', 'La Cocina',
    'Los Girasoles', 'El Mesón', 'La Hacienda', 'Casa Vieja', 'El Portal',
    'La Casita', 'Los Compadres', 'El Jardín', 'La Fonda', 'Casa México'
];

const cuisines = [
    'Mexican', 'Italian', 'Japanese', 'Chinese', 'American',
    'French', 'Spanish', 'Thai', 'Indian', 'Mediterranean',
    'Brazilian', 'Peruvian', 'Argentine', 'Korean', 'Vietnamese'
];

const boroughs = [
    'Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco',
    'El Salto', 'Ixtlahuacán', 'Juanacatlán', 'Chapala', 'Ajijic'
];

const streets = [
    'Avenida Chapultepec', 'Avenida López Mateos', 'Avenida Américas',
    'Calle Independencia', 'Avenida Vallarta', 'Calle Juárez',
    'Avenida México', 'Calle Morelos', 'Avenida Revolución', 'Calle Hidalgo',
    'Avenida Patria', 'Calle Libertad', 'Avenida Colón', 'Calle Corona',
    'Avenida Federalismo'
];

const comments = [
    'Excellent food and service!', 'Great atmosphere', 'Highly recommended',
    'Amazing flavors', 'Will definitely come back', 'Best restaurant in town',
    'Friendly staff', 'Good value for money', 'Delicious dishes',
    'Perfect for families', 'Great location', 'Outstanding quality',
    'Quick service', 'Authentic cuisine', 'Cozy ambiance'
];

// Utility functions
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCoordinate(base, range) {
    return (base + (Math.random() * range - range / 2)).toFixed(6);
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRestaurant(id) {
    const name = `${randomElement(restaurantNames)} ${randomInt(1, 50)}`;
    const cuisine = randomElement(cuisines);
    const borough = randomElement(boroughs);

    // Generate address
    const building = randomInt(100, 9999).toString();
    const street = randomElement(streets);
    const zipcode = randomInt(44100, 45699).toString();
    const lat = parseFloat(randomCoordinate(20.6597, 0.2));
    const lng = parseFloat(randomCoordinate(-103.3496, 0.2));

    // Generate grades (1-5 random grades)
    const numGrades = randomInt(1, 5);
    const grades = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-12-31');

    for (let i = 0; i < numGrades; i++) {
        grades.push({
            date: randomDate(startDate, endDate).toISOString(),
            score: randomInt(5, 30)
        });
    }

    // Generate comments (0-3 random comments)
    const numComments = randomInt(0, 3);
    const restaurantComments = [];

    for (let i = 0; i < numComments; i++) {
        restaurantComments.push({
            _id: new ObjectId().toString(),
            comment: randomElement(comments),
            date: randomDate(new Date('2024-01-01'), new Date()).toISOString()
        });
    }

    return {
        _id: new ObjectId().toString(),
        name,
        cuisine,
        borough,
        address: {
            building,
            street,
            zipcode,
            coord: [lng, lat]
        },
        restaurant_id: 1000 + id,
        grades,
        comments: restaurantComments
    };
}

// Generate 100 restaurants
console.log('Generating 100 restaurant records...');
const restaurants = [];

for (let i = 0; i < 100; i++) {
    restaurants.push(generateRestaurant(i));
}

// Convert to CSV
function jsonToCSV(restaurants) {
    const headers = [
        '_id', 'name', 'cuisine', 'borough', 'building', 'street',
        'zipcode', 'longitude', 'latitude', 'restaurant_id', 'grades', 'comments'
    ];

    const csvRows = [headers.join(',')];

    for (const restaurant of restaurants) {
        const row = [
            restaurant._id,
            `"${restaurant.name}"`,
            `"${restaurant.cuisine}"`,
            `"${restaurant.borough}"`,
            restaurant.address.building,
            `"${restaurant.address.street}"`,
            restaurant.address.zipcode,
            restaurant.address.coord[0],
            restaurant.address.coord[1],
            restaurant.restaurant_id,
            `"${JSON.stringify(restaurant.grades).replace(/"/g, '""')}"`,
            `"${JSON.stringify(restaurant.comments).replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
}

// Save to CSV
const csvData = jsonToCSV(restaurants);
const dataDir = './data';

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(`${dataDir}/restaurants.csv`, csvData);
console.log('✓ CSV file created: ./data/restaurants.csv');

// Also save as JSON for easier import
fs.writeFileSync(`${dataDir}/restaurants.json`, JSON.stringify(restaurants, null, 2));
console.log('✓ JSON file created: ./data/restaurants.json');
console.log(`✓ Successfully generated ${restaurants.length} restaurant records`);