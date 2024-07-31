const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret', // Change this secret in a production environment
    resave: false,
    saveUninitialized: false
}));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shoemarketplace'
});


db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Middleware to check if the user is logged in
function checkAuthentication(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/', checkAuthentication, (req, res) => {
    db.query('SELECT * FROM shoes', (err, results) => {
        if (err) {
            console.error('Error fetching shoes:', err);
            return res.status(500).send('Error fetching shoes');
        }
        const successMessage = req.query.success ? decodeURIComponent(req.query.success) : null;
        res.render('index', { shoes: results, successMessage: successMessage });
    });
});


app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
        if (err) {
            console.error('Error registering new user:', err);
            return res.status(500).send('Failed to register new user.');
        }
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login', { message: req.query.message || '' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err || results.length === 0) {
            res.redirect('/login?message=Incorrect Email and/or Password');
        } else {
            req.session.loggedin = true;
            req.session.userId = results[0].id;
            res.redirect('/');
        }
    });
});


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/addShoe', checkAuthentication, (req, res) => {
    res.render('addShoe');
});

app.post('/addShoe', checkAuthentication, (req, res) => {
    const { brand, description, image_url, price } = req.body;
    let priceValue = parseFloat(price);

    console.log("Attempting to add new shoe with:", { brand, description, image_url, priceValue });

    if (!priceValue || isNaN(priceValue) || priceValue < 0) {
        console.log("Invalid price input:", price);
        return res.redirect(`/addShoe?error=${encodeURIComponent('Invalid price. Please enter a positive number.')}`);
    }

    const query = 'INSERT INTO shoes (brand, description, image_url, price, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [brand, description, image_url, priceValue, req.session.userId], (err, result) => {
        if (err) {
            console.error('SQL Error adding shoe:', err);
            return res.redirect(`/addShoe?error=${encodeURIComponent('Database error: ' + err.message)}`);
        }
        console.log("Shoe added successfully, result:", result);
        res.redirect(`/?success=${encodeURIComponent('Shoe added successfully!')}`);
    });
});



app.get('/shoe/:id', checkAuthentication, (req, res) => {
    db.query('SELECT * FROM shoes WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error('Error fetching shoe details:', err);
            return res.status(500).send('Error fetching shoe details');
        }
        res.render('shoeDetails', { shoe: result[0] });
    });
});

app.get('/editShoe/:id', checkAuthentication, (req, res) => {
    db.query('SELECT * FROM shoes WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error('Error fetching shoe for editing:', err);
            return res.status(500).send('Error fetching shoe for editing');
        }
        res.render('editShoe', { shoe: result[0] });
    });
});

app.post('/updateShoe/:id', checkAuthentication, (req, res) => {
    const { brand, description, image_url, price } = req.body;
    db.query('UPDATE shoes SET brand = ?, description = ?, image_url = ?, price = ? WHERE id = ?',
        [brand, description, image_url, price, req.params.id], (err, result) => {
            if (err) {
                console.error('Error updating shoe:', err);
                return res.status(500).send('Error updating shoe');
            }
            res.redirect('/');
        });
});

app.post('/deleteShoe/:id', checkAuthentication, (req, res) => {
    db.query('DELETE FROM shoes WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting shoe:', err);
            return res.status(500).send('Error deleting shoe');
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));