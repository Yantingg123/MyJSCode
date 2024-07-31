const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const app = express();
 
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination:(req, file, cb)=> {
        cb(null, 'public/images'); //Directory to save upload files
    },
    filename: (req, file, cb)=> {
        cb(null, file.originalname); //File name after upload
    }
});
const upload = multer({ storage: storage });

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

// enable form processing
app.use(express.urlencoded({ extended: false }));
 
// Enable static files
app.use(express.static('public'));

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
 
app.post('/product', (req, res) => {
    const { name, quantity, price, image } = req.body;
    const sql = 'INSERT INTO products ( productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, quantity, price, image], (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            return res.status(500).send('Error adding product');
        }
        res.redirect('/');
    });
});

app.post('/addProduct',upload.single('image'), (req, res) => {
    // Extract product data from the request body
    const { name, quantity, price} = req.body;
    let image;
    if(req.file){
        image = req.file.originalname; //save only the filename
    } else {
        image = null;
    }

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

app.get('/editProduct/:id', (req,res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    // Fetch data from MySQL based on the product ID
    connection.query( sql , [productId], (error, results) => {
    if (error) {
    console.error('Database query error:', error.message);
    return res.status(500).send('Error retrieving product by ID');
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
    // Render HTML page with the product data
    res.render('editProduct', { product: results[0] });
    } else {
    // If no product with the given ID was found, render a 404 page or handle it accordingly
    res.status(404).send('Product not found');
    
    }
    
    });
    
});

app.post('/editProduct/:id', upload.single('image'), (req, res) => {
    const productId = req.params.id;
    // Extract product data from the request body
    const { name, quantity, price } = req.body;
    let image = req.body.currentImage; // retrieve current image filename
    if (req.file) {// if a new image is uploaded
        image = req.file.originalname; // set image to be new image filename
    }
    const sql = 'UPDATE products SET productName = ? , quantity = ?, price = ?, image =?, WHERE productId = ?';
    
    // Insert the new product into the database
    connection.query( sql , [name, quantity, price, image, productId], (error, results) => {
    if (error) {
    // Handle any error that occurs during the database operation
    console.error("Error updating product:", error);
    res.status(500).send('Error updating product');
    } else {
    // Send a success response
    res.redirect('/'); 
    }
    });
});

app.get('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE productId = ?';
    // Delete the product from the database
    connection.query(sql, [productId], (error, results) => {
    if (error) {
    // Handle any error that occurs during the database operation
    console.error("Error deleting product:", error);
    res.status(500).send('Error deleting product');
    } else {
    // Send a success response
    res.redirect('/');
    }
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
