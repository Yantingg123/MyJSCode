// Import the Express.js framework
const express = require('express');
// Create an instance of the Express application
const app = express();
// Specify the port for the server to listen on
const port = 3002;

// Middleware for JSON parsing
app.use(express.json());

// In-memory data for products
let products = [
    { id: 1, name: 'Apple', quantity: 100, price: 1.50 },
    { id: 2, name: 'Banana', quantity: 75, price: 0.80 },
    { id: 3, name: 'Milk', quantity: 50, price: 3.50 },
    { id: 4, name: 'Bread', quantity: 80, price: 1.80 }
];

// Routes for CRUD operations
// Read all products
app.get('/inventory', function(req, res) {
    res.json(products);
});

// Create a new product
app.post('/inventory', function(req, res) {
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Read one product by ID
app.get('/inventory/:id', function(req, res) {
    const productId = parseInt(req.params.id);
    const product = products.find((product) => product.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Update a product by ID
app.put('/inventory/:id', function(req, res) {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    products = products.map(function(product) {
        if (product.id === productId) {
            return { ...product, ...updatedProduct };
        }
        return product;
    });
    res.json(updatedProduct);
});

// Delete a product by ID
app.delete('/inventory/:id', function(req, res) {
    const productId = parseInt(req.params.id);
    products = products.filter(product => product.id !== productId);
    res.json({ message: 'Product deleted successfully' });
});

app.get('/', function (req, res) {
    res.send('Welcome to the Supermarket. Use /inventory to get a list of all products.');
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});