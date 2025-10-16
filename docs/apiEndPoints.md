**Base URL:** `http://localhost:3000/api/v1`

## Restaurants

| Metodo | Endpoint                                   | Descripción                         |
| ------ | ------------------------------------------ | ----------------------------------- |
| GET    | `/restaurants`                             | Get all restaurants (paginated)     |
| GET    | `/restaurants/:id`                         | Get a restaurant by ID              |
| GET    | `/restaurants/restaurant-id/:restaurantId` | Get by `restaurant_id`              |
| POST   | `/restaurants`                             | Create a new restaurant             |
| PUT    | `/restaurants/:id`                         | Update a restaurant (full update)   |
| PATCH  | `/restaurants/:id`                         | Update a restaurant (partial update |
| DELETE | `/restaurants/:id`                         | Delete a restaurant                 |
| GET    | `/restaurants/stats`                       | Get restaurant statistics           |
### Usage Examples

#### Get all restaurants
```bash
curl http://localhost:3000/api/v1/restaurants?page=1&limit=20
```

#### Get a specific restaurant
```bash
curl http://localhost:3000/api/v1/restaurants/507f1f77bcf86cd799439011
```

#### Create a new restaurant
```bash
curl -X POST http://localhost:3000/api/v1/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tacos Don Pepe",
    "cuisine": "Mexican",
    "borough": "Guadalajara",
    "address": {
      "building": "123",
      "street": "Av. Chapultepec",
      "zipcode": "44100",
      "coord": [-103.3496, 20.6597]
    }
  }'
```

#### Partially update a restaurant
```bash
curl -X PATCH http://localhost:3000/api/v1/restaurants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"name": "Tacos Don Pepe Premium"}'
```

#### Delete a restaurant
```bash
curl -X DELETE http://localhost:3000/api/v1/restaurants/507f1f77bcf86cd799439011
