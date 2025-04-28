// 1. Carga variables de entorno desde .env
require('dotenv').config();

// 2. Importa Express
const express = require('express');

// 3. Crea una instancia de la aplicación Express
const app = express();

// 4. Define el puerto (desde .env o por defecto 3000)
const port = process.env.PORT || 3000;

// --- Middleware ---
// 5. Habilita el parseo de JSON en el cuerpo de las solicitudes
app.use(express.json());

// --- Almacenamiento Temporal (Simulación de Base de Datos) ---
let products = [
    { "id": 1, "name": "Laptop Gamer", "price": 1500, "description": "Potente laptop para juegos" },
    { "id": 2, "name": "Teclado Mecánico", "price": 89, "description": "Teclado con switches Cherry MX" },
    { "id": 3, "name": "Monitor 4K", "price": 350, "description": "Monitor de alta resolución 27 pulgadas" }
];
let currentId = 4; // Para generar IDs para nuevos productos

// --- Rutas de la API (Endpoints) ---

// GET /products - Obtener todos los productos
// ****** ESTA ES LA LÍNEA CORREGIDA ******
app.get('/products', (req, res) => {
    console.log('Solicitud GET a /products recibida');
    res.status(200).json(products);
});

// GET /products/:id - Obtener un producto por ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Solicitud GET a /products/${id} recibida`);
    const product = products.find(p => p.id === id);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// POST /products - Crear un nuevo producto
app.post('/products', (req, res) => {
    console.log('Solicitud POST a /products recibida con body:', req.body);
    const { name, price, description } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ message: 'El nombre y el precio son requeridos' });
    }
    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ message: 'El precio debe ser un número positivo' });
    }

    const newProduct = {
        id: currentId++,
        name: name,
        price: parseFloat(price),
        description: description || ""
    };
    products.push(newProduct);
    res.status(201).json(newProduct); // 201 Created
});

// PUT /products/:id - Actualizar un producto existente
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Solicitud PUT a /products/${id} recibida con body:`, req.body);
    const { name, price, description } = req.body;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
    }

    if (!name || price === undefined) {
        return res.status(400).json({ message: 'El nombre y el precio son requeridos para actualizar' });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'El precio debe ser un número positivo' });
    }

    const updatedProduct = {
        ...products[productIndex], // Conserva campos existentes si no se actualizan
        name: name,
        price: parseFloat(price),
        description: description !== undefined ? description : products[productIndex].description
    };
    products[productIndex] = updatedProduct;
    res.status(200).json(updatedProduct); // 200 OK
});

// DELETE /products/:id - Eliminar un producto
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Solicitud DELETE a /products/${id} recibida`);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        res.status(200).json({ message: 'Producto eliminado correctamente', deleted: deletedProduct[0] });
        // res.status(204).send(); // Alternativa
    } else {
        res.status(404).json({ message: 'Producto no encontrado para eliminar' });
    }
});

// --- Middleware para Manejar Rutas No Encontradas (404) ---
app.use((req, res, next) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Ruta no encontrada en la API' });
});

// --- Middleware para Manejar Errores Generales (500) ---
app.use((err, req, res, next) => {
    console.error('Error inesperado:', err.stack);
    res.status(500).json({ message: 'Ocurrió un error interno en el servidor' });
});

// --- Iniciar el Servidor ---
app.listen(port, () => {
    console.log(`Servidor API escuchando en http://localhost:${port}`);
    console.log('Rutas disponibles:');
    console.log('  GET /products');
    console.log('  GET /products/:id');
    console.log('  POST /products');
    console.log('  PUT /products/:id');
    console.log('  DELETE /products/:id');
});