const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.set('view engine', 'ejs');
app.use(express.static('public'));


// Connect to MySQL
const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: "',
    // database: 'c237miniProj'
    host: 'sql.freedb.tech',
    user: 'freedb_Yanting',
    password: 'DP%m3VSq@#nNDXk',
    database: 'freedb_supermarket_app'
 });

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');

});

// Routes
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        // Redirect to a dashboard or shopping page if the user is logged in
        if (req.session.role === 'admin') {
            res.redirect('/inventory');  // Assuming the admin goes to the inventory management page
        } else {
            res.redirect('/shopping');   // Assuming a regular user goes to the shopping page
        }
    } else {
        // Render a welcome or login page if the user is not logged in
        res.render('welcome', { title: 'Welcome to Supermarket App' }); // You need a 'welcome.ejs' for this, or redirect to '/login'
    }
});

app.get('/login', (req, res) => {
    res.render('login', { errors: req.flash('error'), messages: req.flash('success') });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            req.flash('error', 'Server error');
            res.redirect('/login');
        } else if (results.length > 0) {
            req.session.loggedin = true;
            req.session.role = results[0].role;
            req.session.user = results[0];
            if (req.session.role === 'admin') {
                res.redirect('/inventory');
            } else {
                res.redirect('/shopping');
            }
        } else {
            req.flash('error', 'Incorrect Username and/or Password');
            res.redirect('/login');
        }
    });
});

// Register route: handles GET requests to "/register"
app.get('/register', (req, res) => {
    // Fetch any flash messages if present
    const errorMessages = req.flash('error');
    const formData = req.flash('formData')[0]; // Assuming formData is flashed as an object

    res.render('register', {
        messages: errorMessages,
        formData: formData || {}  // Provide default empty object if no formData
    });
});
app.post('/register', (req, res) => {
    const { username, email, password, address, contact, role } = req.body;

    // Simple form validation example
    if (!username || !email || !password || !address || !contact || !role) {
        req.flash('error', 'All fields must be filled out');
        req.flash('formData', req.body);  // Pass back the form data to refill the form
        return res.redirect('/register');
    }

    // Directly use the plain password (not recommended for production)
    const plainPassword = password;

    // Insert into the database (ensure your database connection and query are correctly set up)
    db.query('INSERT INTO users (username, email, password, address, contact, role) VALUES (?, ?, ?, ?, ?, ?)', 
    [username, email, plainPassword, address, contact, role], (err, result) => {
        if (err) {
            console.error('Failed to add user:', err);
            req.flash('error', 'Failed to register. Please try again.');
            return res.redirect('/register');
        }
        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/login');  // Redirect to login page after successful registration
    });
});


app.get('/shopping', (req, res) => {
    if (!req.session.loggedin) {
        // Redirect to login if the user is not logged in
        req.flash('error', 'Please login to view this page');
        return res.redirect('/login');
    }

    // Fetch products from the database
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Failed to retrieve products:', err);
            req.flash('error', 'Error fetching products');
            return res.redirect('/');  // Redirect to home or another error handling page
        }

        // Render the shopping page with products data
        res.render('shopping', {
            user: req.session.user,
            products: results  // Ensure the results are passed correctly
        });
    });
});
app.get('/inventory', (req, res) => {
    if (req.session.loggedin && req.session.user.role === 'admin') {
        // Fetch products from the database to display in inventory management
        db.query('SELECT * FROM products', (err, results) => {
            if (err) {
                console.error('Failed to retrieve products:', err);
                req.flash('error', 'Error fetching products');
                return res.redirect('/');  // Redirect to home or another error handling page
            }

            // Render the inventory page with user and products data
            res.render('inventory', {
                user: req.session.user,
                products: results  // Make sure products data is passed to the template
            });
        });
    } else {
        // If not logged in or not an admin, redirect to login or a permission denied page
        req.flash('error', 'Access restricted to administrators');
        res.redirect('/login');
    }
});
// GET route to display the form for adding a new product
app.get('/addProduct', (req, res) => {
    if (req.session.loggedin && req.session.user.role === 'admin') {
        res.render('addProduct');
    } else {
        req.flash('error', 'Only admins can add products.');
        res.redirect('/login');
    }
});

// POST route to handle the submission of the form
app.post('/product/add', (req, res) => {
    if (req.session.loggedin && req.session.user.role === 'admin') {
        const { productName, quantity, price, image } = req.body;
        const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
        db.query(sql, [productName, quantity, price, image], (err, results) => {
            if (err) {
                console.error('Failed to add product:', err);
                req.flash('error', 'Failed to add product.');
                return res.redirect('/product/add');
            }
            req.flash('success', 'Product added successfully.');
            res.redirect('/inventory');  // Assuming you have an inventory page to list products
        });
    } else {
        req.flash('error', 'Unauthorized access.');
        res.redirect('/login');
    }
});

    
    
// GET route to display the form for editing a product
app.get('/updateProduct', (req, res) => {
    if (req.session.loggedin && req.session.user.role === 'admin') {
        const productId = req.params.id;
        db.query('SELECT * FROM products WHERE productId = ?', [productId], (err, results) => {
            if (err || results.length === 0) {
                req.flash('error', 'Product not found.');
                return res.redirect('/inventory');
            }
            res.render('updateProduct', { product: results[0] });
        });
    } else {
        req.flash('error', 'Unauthorized access.');
        res.redirect('/login');
    }
});

// POST route to handle the submission of the edit form
app.get('/product/:id/update', (req, res) => {
    if (!req.session.loggedin || req.session.user.role !== 'admin') {
        req.flash('error', 'Only admins are allowed to edit products.');
        return res.redirect('/login');
    }

    const productId = req.params.id;
    db.query('SELECT * FROM products WHERE productId = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product details:', err);
            req.flash('error', 'Failed to retrieve product details.');
            return res.redirect('/inventory');
        }
        if (results.length > 0) {
            res.render('updateProduct', {
                product: results[0]
            });
        } else {
            req.flash('error', 'Product not found.');
            return res.redirect('/inventory');
        }
    });
});


app.get('/product/:id/delete', (req, res) => {
    if (req.session.loggedin && req.session.user.role === 'admin') {
        const productId = req.params.id;
        db.query('DELETE FROM products WHERE productId = ?', [productId], (err, result) => {
            if (err) {
                req.flash('error', 'Failed to delete product.');
                return res.redirect('/inventory');
            }
            req.flash('success', 'Product deleted successfully.');
            res.redirect('/inventory');
        });
    } else {
        req.flash('error', 'Unauthorized access.');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    if (req.session) {
        // Destroy the session and handle the response
        req.session.destroy(err => {
            if (err) {
                // Handle error cases
                console.error('Session destruction error:', err);
                return res.redirect('/'); // Redirect to the home page or error page
            }

            // Optionally clear the cookie.
            res.clearCookie('connect.sid'); // Make sure to match the name of your session ID

            // Redirect to the login page or home page after logout
            res.redirect('/login');
        });
    } else {
        // If there is no session, just redirect
        res.redirect('/login');
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
