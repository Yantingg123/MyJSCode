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
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));