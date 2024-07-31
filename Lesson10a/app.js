const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const app = express();

// Database connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_management_db'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your_secret_key',  // Use a real secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }  // Sessions expire after 1 hour of inactivity
}));
app.set('view engine', 'ejs');

// Route handlers
app.get('/', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        connection.query('SELECT * FROM tasks', (error, results) => {
            if (error) {
                return res.status(500).send('Error retrieving tasks');
            }
            res.render('index', { tasks: results });
        });
    }
});

app.get('/login', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
    } else {
        res.render('login', { message: null });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error || results.length == 0 || results[0].password !== password) {
            res.render('login', { message: 'Invalid email or password!' });
        } else {
            req.session.loggedin = true;
            req.session.user = results[0];
            res.redirect('/');
            req.session.user = { id: results[0].id, ...results[0] }; // Store user data in session
        }
    });
});

app.get('/register', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
    } else {
        res.render('register', { message: null });
    }
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (error) => {
        if (error) {
            res.render('register', { message: 'Registration failed!' });
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/addTask', (req, res) => {
    if (req.session.loggedin) {
        res.render('addTask');
    } else {
        res.redirect('/login');
    }
});

app.post('/addTask', (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect('/login');
    }

    const { title, description, priority, deadline, status, category } = req.body;
    const userId = req.session.user.id; // Assuming 'id' is stored in session after login
    const query = 'INSERT INTO tasks (title, description, priority, deadline, status, category, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

    connection.query(query, [title, description, priority, deadline, status, category, userId], (err, result) => {
        if (err) {
            console.error('Error adding new task:', err);
            return res.status(500).send('Failed to add new task.');
        }
        res.redirect('/');  // Redirect to the task list or wherever appropriate
    });
});

app.get('/deleteTask/:id', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');  // Redirect to login if the user is not logged in
        return;
    }

    const taskId = req.params.id;  // Get the task ID from the URL parameter
    const deleteQuery = 'DELETE FROM tasks WHERE id = ?';

    connection.query(deleteQuery, [taskId], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            res.status(500).send('Failed to delete the task.');
            return;
        }
        res.redirect('/');  // Redirect to the task list or home page after deletion
    });
});

app.post('/deleteTask/:id', (req, res) => { if (!req.session.loggedin) {
    res.redirect('/login');  // Redirect to login if the user is not logged in
    return;
}

const taskId = req.params.id;  // Get the task ID from the URL parameter
const deleteQuery = 'DELETE FROM tasks WHERE id = ?';

connection.query(deleteQuery, [taskId], (err, result) => {
    if (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Failed to delete the task.');
        return;
    }
    res.redirect('/');  // Redirect to the task list or home page after deletion
});
});

app.get('/editTask/:id', (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect('/login');
    }

    const taskId = req.params.id;
    const query = 'SELECT * FROM tasks WHERE id = ?';

    connection.query(query, [taskId], (err, results) => {
        if (err) {
            console.error('Error retrieving task:', err);
            return res.status(500).send('Failed to retrieve the task.');
        }
        if (results.length > 0) {
            res.render('editTask', { task: results[0] });
        } else {
            return res.status(404).send('Task not found.');
        }
    });
});

app.post('/updateTask/:id', (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect('/login');
    }

    const taskId = req.params.id;
    const { title, description, priority, deadline, status, category } = req.body;

    const updateQuery = 'UPDATE tasks SET title = ?, description = ?, priority = ?, deadline = ?, status = ?, category = ? WHERE id = ?';

    connection.query(updateQuery, [title, description, priority, deadline, status, category, taskId], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            res.status(500).send('Failed to update the task.');
            return;
        }
        res.redirect('/');  // Redirect to the home page or task list
    });
});

const PORT = process.env.PORT || 3000; // Corrected to use your specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
