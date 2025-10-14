/**
 * Restaurant Model
 * Version: 1.1.0
 * 
 * Representa la estructura de un restaurante en el sistema.
 * Esta clase no contiene lógica de negocio, solo estructura de datos.
 */

const { ObjectId } = require('mongodb');

class Restaurant {
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.cuisine = data.cuisine;
        this.borough = data.borough;
        this.restaurant_id = data.restaurant_id;
        this.address = data.address;
        this.grades = data.grades || [];
        this.comments = data.comments || [];
    }

    /**
     * Valida que los datos mínimos requeridos estén presentes
     */
    static validateRequiredFields(data) {
        const required = ['name', 'cuisine', 'borough', 'address'];
        const missing = required.filter(field => !data[field]);

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Validar estructura de address
        if (data.address) {
            const addressRequired = ['building', 'street', 'zipcode', 'coord'];
            const missingAddress = addressRequired.filter(field => !data.address[field]);

            if (missingAddress.length > 0) {
                throw new Error(`Missing required address fields: ${missingAddress.join(', ')}`);
            }

            // Validar coordenadas
            if (!Array.isArray(data.address.coord) || data.address.coord.length !== 2) {
                throw new Error('Address coordinates must be an array of [longitude, latitude]');
            }
        }

        return true;
    }

    /**
     * Crea un objeto limpio para insertar en la base de datos
     */
    static toDatabase(data) {
        const doc = {
            name: data.name,
            cuisine: data.cuisine,
            borough: data.borough,
            restaurant_id: data.restaurant_id,
            address: {
                building: data.address.building,
                street: data.address.street,
                zipcode: data.address.zipcode,
                coord: data.address.coord // [longitude, latitude]
            },
            grades: data.grades || [],
            comments: data.comments || []
        };

        // Si tiene _id, incluirlo
        if (data._id) {
            doc._id = new ObjectId(data._id);
        }

        return doc;
    }

    /**
     * Convierte un documento de base de datos a formato de respuesta
     */
    static fromDatabase(doc) {
        if (!doc) return null;

        return {
            _id: doc._id.toString(),
            name: doc.name,
            cuisine: doc.cuisine,
            borough: doc.borough,
            restaurant_id: doc.restaurant_id,
            address: doc.address,
            grades: doc.grades,
            comments: doc.comments
        };
    }
}

module.exports = Restaurant;