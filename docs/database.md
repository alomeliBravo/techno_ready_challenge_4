
# Database Schema

### Collection: Restaurant

**Collection purpose:** The purpose of this collection is to store restaurant data such as name, type of cuisine, ratings, address, etc.

### Indexes

| Name & Definition     | Type       | Properties |     |
| --------------------- | ---------- | ---------- | --- |
| `_id_`                | REGULAR    | UNIQUE     |     |
| `idx_restaurant_name` | REGULAR    | ---        |     |
| `idx_cuisine`         | REGULAR    | ---        |     |
| `idx_borough`         | REGULAR    | ---        |     |
| `idx_restaurant_id`   | REGULAR    | UNIQUE     |     |
| `idx_coordinates`     | GEOSPATIAL | ---        |     |
| `idx_cuisine_borough` | REGULAR    | COMPOUND   |     |
| `idx_text_search`     | TEXT       | COMPOUND   |     |

### Document Structure
Every document of restaurant have the following structure:

```json
{
  "_id": ObjectId,                    // ID único de MongoDB
  "name": String,                     // Nombre del restaurante
  "cuisine": String,                  // Tipo de cocina
  "borough": String,                  // Ubicación geográfica
  "restaurant_id": Integer,           // ID único numérico (1000+)
  
  "address": {
    "building": String,               // Número de edificio
    "street": String,                 // Nombre de calle
    "zipcode": String,                // Código postal
    "coord": [Number, Number]         // [longitud, latitud]
  },
  
  "grades": [{
    "date": Date,                     // Fecha de inspección/calificación
    "score": Integer                  // Puntuación (5-30, menor es mejor)
  }],
  
  "comments": [{
    "_id": ObjectId,                  // ID único del comentario
    "comment": String,                // Texto del comentario
    "date": Date                      // Fecha del comentario
  }]
}
```

**Sample document:**

```json
{
  "_id": {
    "$oid": "68e9dd04197551149c154270"
  },
  "name": "El Fogón 10",
  "cuisine": "Peruvian",
  "borough": "Zapopan",
  "address": {
    "building": "2124",
    "street": "Avenida López Mateos",
    "zipcode": "45429",
    "coord": [
      -103.339088,
      20.722698
    ]
  },
  "restaurant_id": 1000,
  "grades": [
    {
      "date": {
        "$date": "2023-11-19T09:20:07.034Z"
      },
      "score": 9
    }
  ],
  "comments": [
    {
      "_id": {
        "$oid": "68e9dd04197551149c15426e"
      },
      "comment": "Quick service",
      "date": {
        "$date": "2025-07-25T01:11:08.407Z"
      }
    }
  ]
}
```

---

