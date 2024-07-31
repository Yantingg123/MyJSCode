const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentlistapp'
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
    const sql = 'SELECT * FROM name';
    // Fetch data from MySQL
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving names');
        }
        // Render HTML page with data
        res.render('index', { names: results });
    });
});

app.get('/name/:id', (req, res) => {
    const nameId = req.params.id;
    const sql = 'SELECT * FROM name WHERE nameId = ?';
    // Fetch data from MySQL
    connection.query(sql, [nameId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving name');
        }
        // Check if any name with the given ID was found
        if (results.length > 0) {
            res.render('name', { name: results[0] });
        } else {
            // If no name with the given ID was found, render a 404 page or handle it accordingly 
            res.status(404).send('Name not found');
        }
    });
});

app.get('/addname', (req, res) => {
    res.render('addname');
});

app.post('/addname', (req, res) => {
    // Extract name data from the request body
    const { name, quantity, price, image } = req.body;
    const sql = 'INSERT INTO name (name, quantity, price, image) VALUES (?, ?, ?, ?)';
    // Insert the new name into the database
    connection.query(sql, [name, quantity, price, image], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error adding name:", error);
            res.status(500).send('Error adding name');
        } else {
            // Send a success response
            res.redirect('/');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
