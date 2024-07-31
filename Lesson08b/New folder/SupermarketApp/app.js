const express = require('express');
const mysql = require('mysql2');
const app = express();
 
// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'c237_supermarketapp'
});
 
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
 
// Set up view engine
app.set('view engine', 'ejs');
 
// Enable static files
app.use(express.static('public'));

app.use(express.urlencoded({ 
    extended: false 
}));
 
// Define routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';  
    // Fetch data from MySQL
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving products');
        }      
        // Render HTML page with data
        res.render('index', { products: results });
    });
});

app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    // Fetch data from MySQL
    connection.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product');
        }
        // Check if any product with the given ID was found
        if (results.length > 0 ) {
            res.render('product', { product: results[0] });
        } else {
            // If no product with the given ID was found, render a 404 page or handle it accordingly 
            res.status(404).send('Product not found');
        }
    });
});
 

app.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

app.post('/addProduct', (req, res) => {
    // Extract product data from the request body
    const { name, quantity, price, image } = req.body;
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    // Insert the new product into the database
    connection.query( sql , [name, quantity, price, image], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error adding product:", error);
            res.status(500).send('Error adding product');
        } else {
            // Send a success response
            res.redirect('/');
        } 
    }); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
